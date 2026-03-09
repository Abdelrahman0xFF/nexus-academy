import { BookOpen, PlayCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProgressBar from "@/components/ProgressBar";
import { studentCourses } from "@/lib/data";
import { AppSelect } from "@/components/ui/app-select";

const StudentCourses = () => {
  return (
    <DashboardLayout type="student">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">My Courses</h1>
        <p className="text-body text-muted-foreground mt-1">All your enrolled courses in one place</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your courses..."
            className="w-full pl-10 pr-4 py-2.5 text-small bg-card rounded-button border border-border outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <AppSelect
            options={["All Status", "Completed", "In Progress", "Not Started"]}
            defaultValue="All Status"
          />
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {studentCourses.map((c) => (
          <Link
            key={c.id}
            to={`/courses/${c.id}`}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-card rounded-card card-shadow p-5 hover-lift group"
          >
            <div className="w-full sm:w-24 h-20 sm:h-16 rounded-lg gradient-primary flex items-center justify-center shrink-0">
              <PlayCircle size={28} className="text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-body font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">{c.title}</h3>
              <p className="text-small text-muted-foreground mt-0.5">{c.instructor} · {c.category} · {c.duration}</p>
              <div className="mt-2 max-w-sm">
                <ProgressBar value={c.progress} />
              </div>
            </div>
            <div className="sm:text-right shrink-0">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                c.progress === 100
                  ? "bg-emerald-500/10 text-emerald-600"
                  : c.progress > 0
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}>
                {c.progress === 100 ? "Completed" : c.progress > 0 ? "In Progress" : "Not Started"}
              </span>
              <div className="text-xs text-muted-foreground mt-1">{c.lastAccessed}</div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentCourses;
