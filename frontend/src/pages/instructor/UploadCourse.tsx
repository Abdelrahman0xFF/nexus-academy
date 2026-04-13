import { Upload, Image, Video, FileText, Plus, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AppSelect } from "@/components/ui/app-select";

const UploadCourse = () => {
  const location = useLocation();
  const editCourse = location.state as {
    id?: string;
    title?: string;
    description?: string;
    category?: string;
    level?: "Beginner" | "Intermediate" | "Advanced";
    price?: number;
    duration?: string;
    lessons?: number;
  } | null;

  const isEditMode = !!editCourse?.id;

  const [title, setTitle] = useState(editCourse?.title || "");
  const [description, setDescription] = useState(editCourse?.description || "");
  const [category, setCategory] = useState(editCourse?.category || "");
  const [level, setLevel] = useState(editCourse?.level || "");
  const [price, setPrice] = useState<number | "">(editCourse?.price || "");

  const [sections, setSections] = useState([
    { title: "Introduction", lessons: [{ title: "Welcome", duration: "" }] },
  ]);

  const addSection = () => {
    setSections([...sections, { title: "", lessons: [{ title: "", duration: "" }] }]);
  };

  const addLesson = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].lessons.push({ title: "", duration: "" });
    setSections(updated);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
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
                    options={["Web Development", "Data Science", "Design", "Mobile Development", "Marketing"]}
                    value={category}
                    onValueChange={setCategory}
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
                  <label className="text-small font-medium text-foreground block mb-1.5">Price ($)</label>
                  <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                  placeholder="49.99"
                  className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20"
                />
                </div>
                <div>
                  <label className="text-small font-medium text-foreground block mb-1.5">Language</label>
                  <AppSelect
                    options={["English", "Spanish", "French"]}
                    defaultValue="English"
                    triggerClassName="px-4 py-2.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-card rounded-card card-shadow p-6">
            <h2 className="text-h3 text-card-foreground mb-5">Course Media</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-border rounded-card p-8 flex flex-col items-center justify-center text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Image size={32} className="text-muted-foreground mb-3" />
                <p className="text-small font-medium text-foreground">Course Thumbnail</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
              <div className="border-2 border-dashed border-border rounded-card p-8 flex flex-col items-center justify-center text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Video size={32} className="text-muted-foreground mb-3" />
                <p className="text-small font-medium text-foreground">Preview Video</p>
                <p className="text-xs text-muted-foreground mt-1">MP4, WebM up to 100MB</p>
              </div>
            </div>
          </div>

          {/* Curriculum */}
          <div className="bg-card rounded-card card-shadow p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-h3 text-card-foreground">Curriculum</h2>
              <Button variant="outline" size="sm" className="rounded-button" onClick={addSection}>
                <Plus size={14} className="mr-1" /> Add Section
              </Button>
            </div>
            <div className="space-y-4">
              {sections.map((section, si) => (
                <div key={si} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText size={16} className="text-primary shrink-0" />
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const u = [...sections];
                        u[si].title = e.target.value;
                        setSections(u);
                      }}
                      placeholder="Section title"
                      className="flex-1 px-3 py-1.5 text-small bg-muted rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                    />
                    <button onClick={() => removeSection(si)} className="p-1 text-muted-foreground hover:text-destructive">
                      <X size={16} />
                    </button>
                  </div>
                  {section.lessons.map((lesson, li) => (
                    <div key={li} className="flex items-center gap-2 ml-7 mb-2">
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => {
                          const u = [...sections];
                          u[si].lessons[li].title = e.target.value;
                          setSections(u);
                        }}
                        placeholder="Lesson title"
                        className="flex-1 px-3 py-1.5 text-small bg-muted/50 rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="text"
                        value={lesson.duration}
                        onChange={(e) => {
                          const u = [...sections];
                          u[si].lessons[li].duration = e.target.value;
                          setSections(u);
                        }}
                        placeholder="Duration"
                        className="w-24 px-3 py-1.5 text-small bg-muted/50 rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addLesson(si)}
                    className="ml-7 text-xs text-primary hover:underline mt-1"
                  >
                    + Add Lesson
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-card card-shadow p-6 sticky top-6">
            <h3 className="text-h3 text-card-foreground mb-4">Publish</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-small">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-amber-600">Draft</span>
              </div>
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
              <Button className="w-full gradient-primary border-0 text-primary-foreground rounded-button hover:opacity-90">
                <Upload size={16} className="mr-2" /> Publish Course
              </Button>
              <Button variant="outline" className="w-full rounded-button">Save as Draft</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadCourse;
