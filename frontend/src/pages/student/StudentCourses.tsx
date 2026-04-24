import { BookOpen, PlayCircle, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProgressBar from "@/components/ProgressBar";
import { AppSelect } from "@/components/ui/app-select";
import { useQuery } from "@tanstack/react-query";
import { enrollmentApi } from "@/lib/enrollment-api";
import { getMediaUrl } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const StudentCourses = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["my-enrollments-all"],
    queryFn: () => enrollmentApi.getMyEnrollments(1, 100),
  });

  const enrollmentData = enrollments?.data || [];
  const filteredEnrollments = enrollmentData.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    let matchesStatus = true;
    if (statusFilter === "Completed") matchesStatus = e.progress === 100;
    if (statusFilter === "In Progress") matchesStatus = e.progress > 0 && e.progress < 100;
    if (statusFilter === "Not Started") matchesStatus = e.progress === 0;
    return matchesSearch && matchesStatus;
  });

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-small bg-card rounded-button border border-border outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <AppSelect
            options={["All Status", "Completed", "In Progress", "Not Started"]}
            defaultValue="All Status"
            value={statusFilter}
            onValueChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {isLoading ? (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="animate-spin text-primary" size={40} />
  </div>
) : filteredEnrollments.length > 0 ? (
  filteredEnrollments.map((c) => (
    <Link
      key={c.course_id}
      to={`/learn/${c.course_id}`}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-card rounded-card card-shadow p-5 hover-lift group"
    >
      <div className="w-full sm:w-24 h-20 sm:h-16 rounded-lg gradient-primary flex items-center justify-center shrink-0 overflow-hidden">
        {c.thumbnail_url ? (
          <img
            src={getMediaUrl(c.thumbnail_url)}
            alt={c.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <PlayCircle size={28} className="text-primary-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-body font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
          {c.title}
        </h3>
        <p className="text-small text-muted-foreground mt-0.5">
          {c.instructor_first_name} {c.instructor_last_name} · Enrolled on{" "}
          {new Date(c.enrolled_at).toLocaleDateString()}
        </p>
        <div className="mt-2 max-w-sm">
          <ProgressBar value={c.progress} />
        </div>
      </div>

      <div className="sm:text-right shrink-0">
        <span
          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
            c.progress === 100
              ? "bg-emerald-500/10 text-emerald-600"
              : c.progress > 0
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {c.progress === 100
            ? "Completed"
            : c.progress > 0
            ? "In Progress"
            : "Not Started"}
        </span>
        <div className="text-xs text-muted-foreground mt-1">
          {Math.round(c.progress)}% Complete
        </div>
      </div>
    </Link>
  ))
) : (
  <div className="bg-card rounded-card card-shadow p-12 text-center">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
      <BookOpen size={32} className="text-muted-foreground" />
    </div>
    <h3 className="text-h3 text-foreground mb-2">No courses found</h3>
    <p className="text-muted-foreground mb-6">
      You haven't enrolled in any courses that match your search.
    </p>
    <Button asChild variant="outline">
      <Link to="/courses">Browse All Courses</Link>
    </Button>
  </div>
)}
      </div>
    </DashboardLayout>
  );
};

export default StudentCourses;
