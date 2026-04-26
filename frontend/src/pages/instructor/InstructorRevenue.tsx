import { DollarSign, TrendingUp, ArrowDownRight, Loader2, Users } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { earningsApi } from "@/lib/earnings-api";
import { enrollmentApi } from "@/lib/enrollment-api";
import { AppPagination } from "@/components/ui/app-pagination";

const InstructorRevenue = () => {
  const [enrollmentPage, setEnrollmentPage] = useState(1);
  const [coursePage, setCoursePage] = useState(1);
  const limit = 10;

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["earnings-summary", coursePage],
    queryFn: () => earningsApi.getSummary(coursePage, 5),
  });

  const { data: analytics = [], isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["earnings-analytics"],
    queryFn: () => earningsApi.getAnalytics(),
  });

  const { data: recentRes, isLoading: isRecentLoading } = useQuery({
    queryKey: ["recent-enrollments", enrollmentPage],
    queryFn: () => enrollmentApi.getInstructorEnrollments(enrollmentPage, limit),
  });

  const transactions = recentRes?.data?.enrollments || []; 
  const totalEnrollments = recentRes?.data?.total || 0;
  const totalEnrollmentPages = Math.ceil(totalEnrollments / limit);

  const courseEarnings = summary?.details || [];
  const totalCourses = summary?.total || 0;
  const totalCoursePages = Math.ceil(totalCourses / 5);

  const currentMonthRevenue = analytics?.[analytics.length - 1]?.revenue || 0;
  const totalStudentsCount = summary?.details?.reduce((acc, curr) => acc + (curr.total_students || 0), 0) || 0;

  const stats = [
    { label: "Total Revenue", value: `$${(summary?.total_revenue || 0).toLocaleString()}`, change: "", up: true },
    { label: "This Month", value: `$${(currentMonthRevenue || 0).toLocaleString()}`, change: "", up: true },
    { label: "Total Students", value: (totalStudentsCount || 0).toLocaleString(), change: "", up: true },
    { label: "Pending Payout", value: "$0", change: "", up: true },
  ];

  return (
    <DashboardLayout type="instructor">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h1 text-foreground">Revenue</h1>
          <p className="text-body text-muted-foreground mt-1">Track your earnings and payouts</p>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isSummaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-card card-shadow p-5 h-32 animate-pulse" />
          ))
        ) : (
          stats.map((s) => (
            <div key={s.label} className="bg-card rounded-card card-shadow p-5">
              <div className="flex items-center gap-2 mb-3">
                {s.label === "Total Students" ? <Users size={16} className="text-primary" /> : <DollarSign size={16} className="text-primary" />}
                <span className="text-small text-muted-foreground">{s.label}</span>
              </div>
              <div className="text-2xl font-bold text-card-foreground">{s.value}</div>
              {s.change && (
                <div className={`flex items-center gap-1 text-xs mt-1 ${s.up ? "text-emerald-600" : "text-destructive"}`}>
                  {s.up ? <TrendingUp size={12} /> : <ArrowDownRight size={12} />}
                  {s.change} vs last month
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Revenue by Course */}
      <div className="bg-card rounded-card card-shadow p-6 mb-8">
        <h2 className="text-h3 text-card-foreground mb-5">Revenue by Course</h2>
        {isSummaryLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : courseEarnings.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              {courseEarnings.map((c) => {
                const maxRevenue = Math.max(...courseEarnings.map(item => item.earning), 1);
                const percentage = (c.earning / maxRevenue) * 100;
                return (
                  <div key={c.course_id}>
                    <div className="flex items-center justify-between text-small mb-1.5">
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-card-foreground truncate">{c.title}</span>
                        <span className="text-[10px] text-muted-foreground">{c.total_students} students</span>
                      </div>
                      <span className="font-bold text-primary shrink-0">${(c.earning || 0).toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <AppPagination 
              currentPage={coursePage} 
              totalPages={totalCoursePages} 
              onPageChange={setCoursePage} 
            />
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No revenue data available.</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-card rounded-card card-shadow">
        <div className="p-6 border-b border-border">
          <h2 className="text-h3 text-card-foreground">Recent Enrollments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Student</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Course</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Method</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase px-6 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {isRecentLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : transactions.length > 0 ? transactions.map((t: any, i: number) => (
                <tr key={i} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-small font-medium text-card-foreground">{t.first_name} {t.last_name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-small text-card-foreground max-w-[200px] truncate">{t.course_title}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-small text-muted-foreground">
                    {new Date(t.enrolled_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary uppercase">
                      {t.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-small font-semibold text-emerald-600">
                      +${(t.enrollment_cost || 0).toLocaleString()}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No recent enrollments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border">
            <AppPagination 
                currentPage={enrollmentPage} 
                totalPages={totalEnrollmentPages} 
                onPageChange={setEnrollmentPage} 
            />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorRevenue;
