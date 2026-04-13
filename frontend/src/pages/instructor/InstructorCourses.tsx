import { BookOpen, Plus, Eye, Edit, Trash2, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import RatingStars from "@/components/RatingStars";
import { courses as initialCourses } from "@/lib/data";
import { AppSelect } from "@/components/ui/app-select";

const InstructorCourses = () => {
  const [courses, setCourses] = useState(initialCourses.slice(0, 4));
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  return (
    <DashboardLayout type="instructor">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h1 text-foreground">My Courses</h1>
          <p className="text-body text-muted-foreground mt-1">
            Manage and organize your published courses
          </p>
        </div>
        <Button
          asChild
          className="gradient-primary border-0 text-primary-foreground rounded-button hover:opacity-90 transition-opacity"
        >
          <Link to="/instructor/upload">
            <Plus size={18} className="mr-2" /> New Course
          </Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search your courses..."
            className="w-full pl-10 pr-4 py-2.5 text-small bg-card rounded-button border border-border outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <AppSelect
            options={["All Status", "Published", "Draft", "Under Review"]}
            defaultValue="All Status"
          />
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {courses.map((c, i) => {
          const status = i === 3 ? "Draft" : "Published";
          return (
            <div
              key={c.id}
              className="bg-card rounded-card card-shadow overflow-hidden hover-lift"
            >
              <div className="h-36 gradient-primary flex items-center justify-center relative">
                <BookOpen size={40} className="text-primary-foreground/40" />
                <span
                  className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full ${
                    status === "Published"
                      ? "bg-emerald-500/20 text-emerald-600"
                      : "bg-amber-500/20 text-amber-600"
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-small font-semibold text-card-foreground mb-1 truncate">
                  {c.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {c.category} · {c.level}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span>{c.students.toLocaleString()} students</span>
                  <RatingStars rating={c.rating} size={12} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-small font-bold text-primary">
                    $
                    {(c.price * c.students * 0.7).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    earned
                  </span>
<div className="flex items-center gap-1">
                      <Link
                        to={`/courses/${c.id}`}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => navigate("/instructor/upload", { state: c })}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default InstructorCourses;
