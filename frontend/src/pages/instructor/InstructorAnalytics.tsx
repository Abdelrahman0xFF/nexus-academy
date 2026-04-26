import { TrendingUp, Users, Clock, BarChart3, Loader2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { earningsApi } from "@/lib/earnings-api";
import { coursesApi } from "@/lib/courses-api";

const InstructorAnalytics = () => {
    const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
        queryKey: ["earnings-analytics"],
        queryFn: () => earningsApi.getAnalytics(),
    });

    const { data: coursesData, isLoading: isCoursesLoading } = useQuery({
        queryKey: ["instructor-courses"],
        queryFn: () => coursesApi.getMyCourses(1, 100),
    });

    const courses = coursesData?.courses || [];
    const totalCoursesCount = coursesData?.total || 0;

    const { data: summary, isLoading: isSummaryLoading } = useQuery({
        queryKey: ["earnings-summary"],
        queryFn: () => earningsApi.getSummary(),
    });

    const totalStudents = courses.reduce(
        (sum, c) => sum + (c.students_count || 0),
        0,
    );

    const stats = [
        {
            label: "Total Students",
            value: (totalStudents || 0).toLocaleString(),
            icon: Users,
        },
        {
            label: "Active Courses",
            value: (totalCoursesCount || 0).toString(),
            icon: BarChart3,
        },
        {
            label: "Total Revenue",
            value: `$${(summary?.total_revenue || 0).toLocaleString()}`,
            icon: TrendingUp,
        },
        {
            label: "Avg. Rating",
            value: (
                courses.reduce((sum, c) => sum + (c.rating || 0), 0) /
                (courses.length || 1)
            ).toFixed(1),
            icon: Clock,
        },
    ];

    const levelDist = courses.reduce((acc: any, c) => {
        acc[c.level] = (acc[c.level] || 0) + 1;
        return acc;
    }, {});

    const levels = ["Beginner", "Intermediate", "Advanced"];

    return (
        <DashboardLayout type="instructor">
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <h1 className="text-h1 text-foreground">Analytics</h1>
                <p className="text-body text-muted-foreground mt-1">
                    Track your course performance and engagement
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {isCoursesLoading || isSummaryLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                          <div
                              key={i}
                              className="bg-card rounded-card card-shadow p-5 h-32 animate-pulse"
                          />
                      ))
                    : stats.map((s, idx) => (
                          <div
                              key={s.label}
                              className="bg-card rounded-card card-shadow p-5 group border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                              style={{ animationDelay: `${idx * 100}ms` }}
                          >
                              <div className="flex items-center justify-between mb-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                      <s.icon
                                          size={20}
                                          className="text-primary"
                                      />
                                  </div>
                              </div>
                              <div className="text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                                  {s.value}
                              </div>
                              <div className="text-small text-muted-foreground">
                                  {s.label}
                              </div>
                          </div>
                      ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Revenue Chart */}
                    <div className="bg-card rounded-card card-shadow p-6 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-left-4 duration-700 delay-200 fill-mode-both">
                        <h2 className="text-h3 text-card-foreground mb-6">
                            Monthly Revenue
                        </h2>
                        {isAnalyticsLoading ? (
                            <div className="flex items-center justify-center h-52">
                                <Loader2
                                    className="animate-spin text-primary"
                                    size={32}
                                />
                            </div>
                        ) : analytics && analytics.length > 0 ? (
                            <div className="flex items-end gap-2 h-52 overflow-x-auto pb-2 custom-scrollbar">
                                {analytics.map((d, i) => {
                                    const maxRevenue = Math.max(
                                        ...analytics.map(
                                            (item) => item.revenue,
                                        ),
                                        1,
                                    );
                                    const percentage =
                                        (d.revenue / maxRevenue) * 90;
                                    return (
                                        <div
                                            key={i}
                                            className="flex-1 flex flex-col items-center justify-end gap-1 min-w-[40px] group relative h-full"
                                        >
                                            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10">
                                                $
                                                {(
                                                    d.revenue || 0
                                                ).toLocaleString()}
                                            </div>
                                            <div className="text-[9px] font-bold text-primary mb-1">
                                                {d.revenue > 0
                                                    ? `$${Math.round(d.revenue)}`
                                                    : ""}
                                            </div>
                                            <div
                                                className="w-full rounded-t-sm gradient-primary opacity-80 hover:opacity-100 transition-all duration-500 cursor-pointer"
                                                style={{
                                                    height: `${percentage}%`,
                                                }}
                                            />
                                            <span className="text-[10px] text-muted-foreground mt-1 shrink-0">
                                                {d.month}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-52 text-muted-foreground text-small">
                                No revenue analytics available.
                            </div>
                        )}
                        <div className="flex items-center gap-6 mt-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="w-3 h-3 rounded-sm gradient-primary" />{" "}
                                Revenue
                            </div>
                        </div>
                    </div>

                    {/* Top Courses by Earning */}
                    <div className="bg-card rounded-card card-shadow p-6 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
                        <h2 className="text-h3 text-card-foreground mb-6">
                            Top Earning Courses
                        </h2>
                        <div className="space-y-6">
                            {isSummaryLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2
                                        className="animate-spin text-primary"
                                        size={24}
                                    />
                                </div>
                            ) : summary?.details &&
                              summary.details.length > 0 ? (
                                summary.details.slice(0, 5).map((c, i) => {
                                    const maxEarning = Math.max(
                                        ...summary.details.map(
                                            (d) => d.earning,
                                        ),
                                        1,
                                    );
                                    const percentage =
                                        (c.earning / maxEarning) * 100;
                                    return (
                                        <div key={i} className="group">
                                            <div className="flex justify-between text-small mb-2">
                                                <span className="font-medium text-foreground truncate mr-4 group-hover:text-primary transition-colors">
                                                    {c.title}
                                                </span>
                                                <span className="font-bold text-primary">
                                                    $
                                                    {(
                                                        c.earning || 0
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden transition-colors group-hover:bg-muted/80">
                                                <div
                                                    className="h-full gradient-primary rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-[10px] text-muted-foreground">
                                                    {c.total_students} students
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-muted-foreground text-small py-8">
                                    No earning data available.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8 sticky top-6 self-start">
                    {/* Level Distribution */}
                    <div className="bg-card rounded-card card-shadow p-6 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-right-4 duration-700 delay-400 fill-mode-both">
                        <h2 className="text-h3 text-card-foreground mb-6">
                            Level Distribution
                        </h2>
                        <div className="space-y-4">
                            {isCoursesLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2
                                        className="animate-spin text-primary"
                                        size={20}
                                    />
                                </div>
                            ) : courses.length > 0 ? (
                                levels.map((level) => {
                                    const count = levelDist[level] || 0;
                                    const percentage =
                                        (count / courses.length) * 100;
                                    return (
                                        <div key={level} className="group">
                                            <div className="flex justify-between text-small mb-1.5">
                                                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                                    {level}
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    {count} courses
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden transition-colors group-hover:bg-muted/80">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                                        level === "Beginner"
                                                            ? "bg-emerald-500"
                                                            : level ===
                                                                "Intermediate"
                                                              ? "bg-amber-500"
                                                              : level ===
                                                                  "Advanced"
                                                                ? "bg-red-500"
                                                                : "bg-primary"
                                                    }`}
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-muted-foreground text-small py-4">
                                    No course data.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InstructorAnalytics;
