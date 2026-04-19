import { Trophy, Target, Clock, Flame, Loader2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProgressBar from "@/components/ProgressBar";
import { studentCourses } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { enrollmentApi } from "@/lib/enrollment-api";

const StudentProgress = () => {
  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["my-enrollments-progress"],
    queryFn: () => enrollmentApi.getMyEnrollments(1, 100),
  });

  const enrollmentData = enrollments?.data || [];
  const totalProgress = enrollmentData.length > 0 
    ? Math.round(enrollmentData.reduce((a, c) => a + c.progress, 0) / enrollmentData.length)
    : 0;
  const completed = enrollmentData.filter((c) => c.progress >= 100).length;

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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Target, label: "Overall Progress", value: `${totalProgress}%`, color: "bg-primary/10 text-primary" },
          { icon: Trophy, label: "Courses Completed", value: `${completed}`, color: "bg-emerald-500/10 text-emerald-600" },
          { icon: Clock, label: "Hours Learned", value: "86", color: "bg-secondary/10 text-secondary" },
          { icon: Flame, label: "Day Streak", value: "12", color: "bg-amber-500/10 text-amber-600" },
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

      {/* Weekly Activity */}
      <div className="bg-card rounded-card card-shadow p-6 mb-8">
        <h2 className="text-h3 text-card-foreground mb-5">Weekly Activity</h2>
        <div className="flex items-end gap-3 h-40">
          {[
            { day: "Mon", hours: 2.5 },
            { day: "Tue", hours: 1.8 },
            { day: "Wed", hours: 3.2 },
            { day: "Thu", hours: 0.5 },
            { day: "Fri", hours: 2.1 },
            { day: "Sat", hours: 4.0 },
            { day: "Sun", hours: 1.2 },
          ].map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md gradient-primary opacity-80 hover:opacity-100 transition-opacity cursor-pointer min-h-[4px]"
                style={{ height: `${(d.hours / 4) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
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
