import { Upload, Image, Video, FileText, Plus, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AppSelect } from "@/components/ui/app-select";
import { Category, categoryApi } from "@/lib/categories-api";
import { coursesApi, sectionsApi, lessonsApi } from "@/lib/courses-api";
import { useToast } from "@/hooks/use-toast";

interface LessonForm {
  title: string;
  description: string;
  video: File | null;
}

interface SectionForm {
  title: string;
  lessons: LessonForm[];
}

const UploadCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const editCourse = location.state as {
    id?: string;
    title?: string;
    description?: string;
    category?: string;
    level?: "Beginner" | "Intermediate" | "Advanced";
    price?: number;
    original_price?: number;
    duration?: string;
    lessons?: number;
  } | null;

  const isEditMode = !!editCourse?.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState("");

  const [title, setTitle] = useState(editCourse?.title || "");
  const [description, setDescription] = useState(editCourse?.description || "");
  const [categoryId, setCategoryId] = useState<string>("");
  const [level, setLevel] = useState(editCourse?.level || "Beginner");
  const [price, setPrice] = useState<number | "">(editCourse?.price ?? "");
  const [originalPrice, setOriginalPrice] = useState<number | "">(editCourse?.original_price ?? "");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const [sections, setSections] = useState<SectionForm[]>(() => {
    return [
      { title: "Introduction", lessons: [{ title: "Welcome", description: "", video: null }] },
    ];
  });

  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await categoryApi.getAll();
        const cats = Array.isArray(data) ? data : [];
        setCategories(cats);
        
        if (editCourse?.category && cats.length > 0) {
          const cat = cats.find(c => c.name === editCourse.category);
          if (cat) setCategoryId(cat.category_id.toString());
        }
      } catch (error: unknown) {
        console.error("Failed to fetch categories:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch categories",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [editCourse, toast]);

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

    // Curriculum Validation
    for (let si = 0; si < sections.length; si++) {
      if (!sections[si].title.trim()) {
        toast({
          title: "Validation Error",
          description: `Section ${si + 1} must have a title`,
          variant: "destructive",
        });
        return;
      }
      if (sections[si].lessons.length === 0) {
        toast({
          title: "Validation Error",
          description: `Section ${si + 1} must have at least one lesson`,
          variant: "destructive",
        });
        return;
      }
      for (let li = 0; li < sections[si].lessons.length; li++) {
        const lesson = sections[si].lessons[li];
        if (!lesson.title.trim()) {
          toast({
            title: "Validation Error",
            description: `Lesson ${li + 1} in section ${si + 1} must have a title`,
            variant: "destructive",
          });
          return;
        }
        if (!isEditMode && !lesson.video) {
          toast({
            title: "Validation Error",
            description: `Lesson ${li + 1} in section ${si + 1} must have a video file`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    setPublishing(true);
    try {
      setPublishProgress("Creating course...");
      const courseFormData = new FormData();
      courseFormData.append("title", title);
      courseFormData.append("description", description);
      courseFormData.append("category_id", categoryId);
      courseFormData.append("level", level);
      courseFormData.append("original_price", originalPrice.toString());
      if (price !== "") courseFormData.append("price", price.toString());
      if (thumbnail) courseFormData.append("thumbnail", thumbnail);

      let courseId: number;
      if (isEditMode) {
        const updatedCourse = await coursesApi.update(Number(editCourse?.id), courseFormData);
        courseId = updatedCourse.course_id;
      } else {
        const newCourse = await coursesApi.create(courseFormData);
        courseId = newCourse.course_id;
      }

      for (let si = 0; si < sections.length; si++) {
        const section = sections[si];
        setPublishProgress(`Creating section ${si + 1}: ${section.title}...`);
        
        await sectionsApi.create({
          course_id: courseId,
          section_order: si + 1,
          title: section.title
        });

        for (let li = 0; li < section.lessons.length; li++) {
          const lesson = section.lessons[li];
          setPublishProgress(`Uploading lesson ${li + 1} of section ${si + 1}: ${lesson.title}...`);
          
          const lessonFormData = new FormData();
          lessonFormData.append("course_id", courseId.toString());
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

      toast({
        title: "Success",
        description: `Course ${isEditMode ? "updated" : "published"} successfully!`,
      });
      navigate("/instructor/courses");
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish course",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
      setPublishProgress("");
    }
  };

  return (
    <DashboardLayout type="instructor">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">{isEditMode ? "Edit Course" : "Upload Course"}</h1>
        <p className="text-body text-muted-foreground mt-1">{isEditMode ? "Update your course details" : "Create and publish a new course"}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
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
                    onValueChange={setLevel}
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
                  <img src={thumbnailPreview} alt="Thumbnail preview" className="absolute inset-0 w-full h-full object-cover" />
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

          {/* Curriculum */}
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
                <span className="text-muted-foreground">Visibility</span>
                <span className="font-medium text-foreground">Public</span>
              </div>
              <div className="flex justify-between text-small">
                <span className="text-muted-foreground">Sections</span>
                <span className="font-medium text-foreground">{sections.length}</span>
              </div>
              <div className="flex justify-between text-small">
                <span className="text-muted-foreground">Lessons</span>
                <span className="font-medium text-foreground">{sections.reduce((a, s) => a + s.lessons.length, 0)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={handlePublish}
                disabled={publishing}
                className="w-full gradient-primary border-0 text-primary-foreground rounded-button hover:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {publishing ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Publishing...
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
                <li>Each lesson MUST have a video file.</li>
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

