import {
  BookOpen,
  Clock,
  Trophy,
  Award,
  TrendingUp,
  ArrowRight,
  PlayCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import CourseCard from "@/components/CourseCard";
import ProgressBar from "@/components/ProgressBar";
import { studentCourses, courses } from "@/lib/data";

const StudentDashboard = () => {
  return (
    <DashboardLayout type="student">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">Welcome back, Alex! 👋</h1>
        <p className="text-body text-muted-foreground mt-1">Continue where you left off</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpen, label: "Enrolled Courses", value: "4", color: "bg-primary/10 text-primary" },
          { icon: Clock, label: "Hours Learned", value: "86", color: "bg-secondary/10 text-secondary" },
          { icon: Trophy, label: "Completed", value: "1", color: "bg-amber-500/10 text-amber-600" },
          { icon: Award, label: "Certificates", value: "1", color: "bg-emerald-500/10 text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-card card-shadow p-5">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-card-foreground">{s.value}</div>
            <div className="text-small text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      <div className="bg-card rounded-card card-shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-h3 text-card-foreground">Continue Learning</h2>
          <Link to="/dashboard/courses" className="text-primary text-small font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="space-y-4">
          {studentCourses.slice(0, 3).map((c) => (
            <Link key={c.id} to={`/courses/${c.id}`} className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group">
              <div className="w-16 h-16 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <PlayCircle size={24} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-small font-semibold text-card-foreground truncate group-hover:text-primary transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{c.instructor} · {c.lastAccessed}</p>
                <ProgressBar value={c.progress} className="mt-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div>
        <h2 className="text-h3 text-foreground mb-5">Recommended for You</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(4, 7).map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
