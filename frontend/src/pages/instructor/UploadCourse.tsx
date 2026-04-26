import { Upload, Image, Video, Plus, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AppSelect } from "@/components/ui/app-select";
import { categoryApi } from "@/lib/categories-api";
import { coursesApi, sectionsApi, lessonsApi, SectionForm, LessonForm } from "@/lib/courses-api";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";

const UploadCourse = ({ isEditOverride = false }: { isEditOverride?: boolean }) => {
  const { id: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const editCourse = location.state as any;
  const isEditMode = isEditOverride || !!paramId;
  const courseId = paramId || editCourse?.course_id || editCourse?.id;

  const [publishing, setPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [price, setPrice] = useState<number | "">("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const [sections, setSections] = useState<SectionForm[]>([
    { title: "Introduction", lessons: [{ title: "Welcome", description: "", video: null }] }
  ]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll(),
  });

  const { isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) return null;
      const courseData = await coursesApi.getById(Number(courseId));
      setTitle(courseData.title);
      setDescription(courseData.description);
      setCategoryId(courseData.category_id.toString());
      setLevel(courseData.level);
      setPrice(courseData.price || "");
      setOriginalPrice(courseData.original_price);
      setIsAvailable(courseData.is_available);
      setThumbnailPreview(courseData.thumbnail_url);
      return courseData;
    },
    enabled: isEditMode && !!courseId,
  });

  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSection = () => {
    setSections([...sections, { title: "", lessons: [{ title: "", description: "", video: null }] }]);
  };

  const addLesson = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].lessons.push({ title: "", description: "", video: null });
    setSections(updated);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].lessons = updated[sectionIndex].lessons.filter((_, i) => i !== lessonIndex);
    setSections(updated);
  };

  const handleLessonVideoChange = (sectionIndex: number, lessonIndex: number, file: File) => {
    const updated = [...sections];
    updated[sectionIndex].lessons[lessonIndex].video = file;
    setSections(updated);
  };

  const handlePublish = async () => {
    if (!title || !description || !categoryId || !level || !originalPrice) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required basic information",
        variant: "destructive",
      });
      return;
    }

    if (!isEditMode && !thumbnail) {
      toast({
        title: "Validation Error",
        description: "Please upload a course thumbnail",
        variant: "destructive",
      });
      return;
    }

    setPublishing(true);
    try {
      setPublishProgress(isEditMode ? "Updating course..." : "Creating course...");
      const courseFormData = new FormData();
      courseFormData.append("title", title);
      courseFormData.append("description", description);
      courseFormData.append("category_id", categoryId);
      courseFormData.append("level", level);
      courseFormData.append("original_price", originalPrice.toString());
      courseFormData.append("is_available", isAvailable ? "true" : "false");
      if (price !== "") courseFormData.append("price", price.toString());
      if (thumbnail) courseFormData.append("thumbnail", thumbnail);

      let publishedCourseId: number;
      if (isEditMode) {
        const id = courseId;
        const updatedCourse = await coursesApi.update(Number(id), courseFormData);
        publishedCourseId = updatedCourse.course_id || Number(id);
      } else {
        const newCourse = await coursesApi.create(courseFormData);
        publishedCourseId = newCourse.course_id;
      }

      if (!isEditMode) {
        for (let si = 0; si < sections.length; si++) {
          const section = sections[si];
          setPublishProgress(`Creating section ${si + 1}: ${section.title}...`);
          
          await sectionsApi.create({
            course_id: publishedCourseId,
            section_order: si + 1,
            title: section.title
          });

          for (let li = 0; li < section.lessons.length; li++) {
            const lesson = section.lessons[li];
            setPublishProgress(`Uploading lesson ${li + 1} of section ${si + 1}: ${lesson.title}...`);
            
            const lessonFormData = new FormData();
            lessonFormData.append("course_id", publishedCourseId.toString());
            lessonFormData.append("section_order", (si + 1).toString());
            lessonFormData.append("lesson_order", (li + 1).toString());
            lessonFormData.append("title", lesson.title);
            lessonFormData.append("description", lesson.description);
            if (lesson.video) {
              lessonFormData.append("video", lesson.video);
            }

            await lessonsApi.create(lessonFormData);
          }
        }
      }

      toast({
        title: "Success",
        description: `Course ${isEditMode ? "updated" : "published"} successfully!`,
      });
      navigate("/instructor/courses");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to publish course",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
      setPublishProgress("");
    }
  };

  if (isEditMode && isCourseLoading) {
    return (
      <DashboardLayout type="instructor">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="instructor">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">{isEditMode ? "Edit Course" : "Upload Course"}</h1>
        <p className="text-body text-muted-foreground mt-1">{isEditMode ? "Update your course details" : "Create and publish a new course"}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card rounded-card card-shadow p-6">
            <h2 className="text-h3 text-card-foreground mb-5">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-small font-medium text-foreground block mb-1.5">Course Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete Web Development Bootcamp"
                  className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-small font-medium text-foreground block mb-1.5">Short Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview of your course..."
                  rows={3}
                  className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-small font-medium text-foreground block mb-1.5">Category</label>
                  <AppSelect
                    options={(categories || []).map(c => ({ value: c.category_id.toString(), label: c.name }))}
                    value={categoryId}
                    onValueChange={setCategoryId}
                    placeholder="Select category"
                    triggerClassName="px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="text-small font-medium text-foreground block mb-1.5">Level</label>
                  <AppSelect
                    options={["Beginner", "Intermediate", "Advanced"]}
                    value={level}
                    onValueChange={(val) => setLevel(val as any)}
                    placeholder="Select level"
                    triggerClassName="px-4 py-2.5"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-small font-medium text-foreground block mb-1.5">Original Price ($)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : "")}
                    placeholder="99.99"
                    className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-small font-medium text-foreground block mb-1.5">Discounted Price ($) (Optional)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                    placeholder="49.99"
                    className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="is_available" 
                  checked={isAvailable} 
                  onCheckedChange={(checked) => setIsAvailable(checked === true)} 
                />
                <label
                  htmlFor="is_available"
                  className="text-small font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Make this course available for enrollment
                </label>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-card rounded-card card-shadow p-6">
            <h2 className="text-h3 text-card-foreground mb-5">Course Media</h2>
            <div className="grid gap-4">
              <div 
                onClick={() => thumbnailInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-card p-8 flex flex-col items-center justify-center text-center hover:border-primary/40 transition-colors cursor-pointer relative overflow-hidden h-48"
              >
                {thumbnailPreview ? (
                  <img src={thumbnailPreview.startsWith("http") ? thumbnailPreview : (thumbnailPreview.includes("base64") ? thumbnailPreview : `http://localhost:4000/api/media/${thumbnailPreview}`)} alt="Thumbnail preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <Image size={32} className="text-muted-foreground mb-3" />
                    <p className="text-small font-medium text-foreground">Course Thumbnail</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={thumbnailInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleThumbnailChange}
                />
              </div>
            </div>
          </div>

          {!isEditMode && (
            <div className="bg-card rounded-card card-shadow p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-h3 text-card-foreground">Course Content</h2>
                <Button variant="outline" size="sm" className="rounded-button" onClick={addSection}>
                  <Plus size={14} className="mr-1" /> Add Section
                </Button>
              </div>
              <div className="space-y-4">
                {sections.map((section, si) => (
                  <div key={si} className="border border-border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {si + 1}
                      </div>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const u = [...sections];
                          u[si].title = e.target.value;
                          setSections(u);
                        }}
                        placeholder="Section title"
                        className="flex-1 px-3 py-1.5 text-small bg-background rounded-button border border-border outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                      />
                      <button onClick={() => removeSection(si)} className="p-1 text-muted-foreground hover:text-destructive">
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="space-y-3 ml-6">
                      {section.lessons.map((lesson, li) => (
                        <div key={li} className="bg-background border border-border rounded-md p-3 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">L{li + 1}</span>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => {
                                const u = [...sections];
                                u[si].lessons[li].title = e.target.value;
                                setSections(u);
                              }}
                              placeholder="Lesson title"
                              className="flex-1 px-3 py-1 text-small bg-muted/50 rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button onClick={() => removeLesson(si, li)} className="p-1 text-muted-foreground hover:text-destructive">
                              <X size={14} />
                            </button>
                          </div>
                          
                          <textarea
                            value={lesson.description}
                            onChange={(e) => {
                              const u = [...sections];
                              u[si].lessons[li].description = e.target.value;
                              setSections(u);
                            }}
                            placeholder="Lesson description (optional)"
                            rows={2}
                            className="w-full px-3 py-1.5 text-xs bg-muted/30 rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                          />
                          
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleLessonVideoChange(si, li, file);
                                }}
                                className="hidden"
                                id={`video-${si}-${li}`}
                              />
                              <label 
                                htmlFor={`video-${si}-${li}`}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-button border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors w-fit"
                              >
                                <Video size={14} />
                                {lesson.video ? lesson.video.name : "Upload Lesson Video"}
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addLesson(si)}
                        className="text-xs text-primary font-medium hover:underline flex items-center gap-1 mt-1"
                      >
                        <Plus size={12} /> Add Lesson
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-card card-shadow p-6 sticky top-6">
            <h3 className="text-h3 text-card-foreground mb-4">Publish</h3>
            {publishing && (
              <div className="mb-4 p-3 bg-primary/5 rounded-md border border-primary/10">
                <div className="flex items-center gap-2 text-xs text-primary font-medium mb-1">
                  <Loader2 size={14} className="animate-spin" />
                  Processing...
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  {publishProgress}
                </p>
              </div>
            )}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-small">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${isAvailable ? "text-emerald-600" : "text-amber-600"}`}>
                  {isAvailable ? "Available" : "Draft"}
                </span>
              </div>
              {!isEditMode && (
                <>
                  <div className="flex justify-between text-small">
                    <span className="text-muted-foreground">Sections</span>
                    <span className="font-medium text-foreground">{sections.length}</span>
                  </div>
                  <div className="flex justify-between text-small">
                    <span className="text-muted-foreground">Lessons</span>
                    <span className="font-medium text-foreground">{sections.reduce((a, s) => a + s.lessons.length, 0)}</span>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-2">
              <Button 
                onClick={handlePublish}
                disabled={publishing}
                className="w-full gradient-primary border-0 text-primary-foreground rounded-button hover:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {publishing ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" /> {isEditMode ? "Update Course" : "Publish Course"}
                  </>
                )}
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-card border border-border">
              <h4 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Instructions</h4>
              <ul className="text-[11px] text-muted-foreground space-y-2 list-disc pl-4">
                <li>Fill all required fields marked in the form.</li>
                {!isEditMode && <li>Each lesson MUST have a video file.</li>}
                <li>Maximum video size: 100MB.</li>
                <li>Thumbnail image should be landscape (16:9).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadCourse;


