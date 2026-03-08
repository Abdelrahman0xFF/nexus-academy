import { TrendingUp, TrendingDown, Users, Eye, Clock, BarChart3 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { courses } from "@/lib/data";

const InstructorAnalytics = () => {
  const stats = [
    { label: "Total Views", value: "124,580", change: "+12.5%", up: true, icon: Eye },
    { label: "Total Students", value: "45,820", change: "+8.3%", up: true, icon: Users },
    { label: "Avg. Watch Time", value: "32m", change: "-2.1%", up: false, icon: Clock },
    { label: "Completion Rate", value: "68%", change: "+5.7%", up: true, icon: BarChart3 },
  ];

  const topCourses = courses.slice(0, 4).map((c, i) => ({
    ...c,
    views: [12400, 9800, 8200, 6100][i],
    enrollments: [1240, 890, 720, 450][i],
    completionRate: [72, 65, 81, 58][i],
  }));

  return (
    <DashboardLayout type="instructor">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">Analytics</h1>
        <p className="text-body text-muted-foreground mt-1">Track your course performance and engagement</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-card card-shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon size={20} className="text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${s.up ? "text-emerald-600" : "text-destructive"}`}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-card-foreground">{s.value}</div>
            <div className="text-small text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Engagement Chart */}
      <div className="bg-card rounded-card card-shadow p-6 mb-8">
        <h2 className="text-h3 text-card-foreground mb-6">Monthly Engagement</h2>
        <div className="flex items-end gap-3 h-52">
          {[
            { month: "Jan", views: 45, enrollments: 30 },
            { month: "Feb", views: 52, enrollments: 35 },
            { month: "Mar", views: 48, enrollments: 32 },
            { month: "Apr", views: 61, enrollments: 45 },
            { month: "May", views: 55, enrollments: 40 },
            { month: "Jun", views: 72, enrollments: 55 },
            { month: "Jul", views: 68, enrollments: 48 },
            { month: "Aug", views: 82, enrollments: 62 },
            { month: "Sep", views: 75, enrollments: 58 },
            { month: "Oct", views: 90, enrollments: 70 },
            { month: "Nov", views: 85, enrollments: 65 },
            { month: "Dec", views: 95, enrollments: 78 },
          ].map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5">
                <div className="flex-1 rounded-t-sm bg-primary/20" style={{ height: `${d.views * 2}px` }} />
                <div className="flex-1 rounded-t-sm gradient-primary opacity-80" style={{ height: `${d.enrollments * 2}px` }} />
              </div>
              <span className="text-[10px] text-muted-foreground">{d.month.slice(0, 3)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded-sm bg-primary/20" /> Views
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded-sm gradient-primary" /> Enrollments
          </div>
        </div>
      </div>

      {/* Top Courses Table */}
      <div className="bg-card rounded-card card-shadow">
        <div className="p-6 border-b border-border">
          <h2 className="text-h3 text-card-foreground">Course Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Course</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Views</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Enrollments</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Completion</th>
              </tr>
            </thead>
            <tbody>
              {topCourses.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-small font-medium text-card-foreground">{c.title}</td>
                  <td className="px-6 py-4 text-small text-muted-foreground">{c.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-small text-muted-foreground">{c.enrollments.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted max-w-[100px]">
                        <div className="h-full rounded-full gradient-primary" style={{ width: `${c.completionRate}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{c.completionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorAnalytics;
