import { Trophy, Target, Loader2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProgressBar from "@/components/ProgressBar";
import { useQuery } from "@tanstack/react-query";
import { enrollmentApi } from "@/lib/enrollment-api";

const StudentProgress = () => {
  const { data: enrollmentsRes, isLoading } = useQuery({
    queryKey: ["my-enrollments-progress"],
    queryFn: () => enrollmentApi.getMyEnrollments(1, 100),
  });

  const enrollmentData = enrollmentsRes?.data?.enrollments || [];
  const totalProgress = enrollmentData.length > 0 
    ? Math.round(enrollmentData.reduce((a, c) => a + (c.progress || 0), 0) / enrollmentData.length)
    : 0;
  const completed = enrollmentData.filter((c) => (c.progress || 0) >= 95).length;

  if (isLoading) {
    return (
      <DashboardLayout type="student">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="student">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">Progress</h1>
        <p className="text-body text-muted-foreground mt-1">Track your learning journey</p>
      </div>

      {/* Course Progress */}
      <div className="bg-card rounded-card card-shadow p-6">
        <h2 className="text-h3 text-card-foreground mb-5">Course Progress</h2>
        {enrollmentData.length > 0 ? (
          <div className="space-y-5">
            {enrollmentData.map((c) => (
              <div key={c.course_id}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-small font-semibold text-card-foreground">{c.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {c.instructor_first_name} {c.instructor_last_name} · {Math.round(c.progress)}% Complete
                    </p>
                  </div>
                </div>
                <ProgressBar value={c.progress} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No course progress to display.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentProgress;
