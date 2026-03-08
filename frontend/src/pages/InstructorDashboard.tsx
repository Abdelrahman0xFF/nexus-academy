import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import RatingStars from "@/components/RatingStars";
import { courses } from "@/lib/data";

const InstructorDashboard = () => {
  const myCourses = courses.slice(0, 4);

  return (
    <DashboardLayout type="instructor">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h1 text-foreground">Instructor Dashboard</h1>
          <p className="text-body text-muted-foreground mt-1">Manage your courses and track performance</p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground rounded-button hover:opacity-90 transition-opacity">
          <Plus size={18} className="mr-2" /> Create Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpen, label: "Total Courses", value: "4", change: "+1 this month", color: "bg-primary/10 text-primary" },
          { icon: Users, label: "Total Students", value: "45,820", change: "+2.4k this month", color: "bg-secondary/10 text-secondary" },
          { icon: DollarSign, label: "Revenue", value: "$12,480", change: "+18% vs last month", color: "bg-emerald-500/10 text-emerald-600" },
          { icon: TrendingUp, label: "Avg. Rating", value: "4.85", change: "Top 5% instructor", color: "bg-amber-500/10 text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-card card-shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold text-card-foreground">{s.value}</div>
            <div className="text-small text-muted-foreground">{s.label}</div>
            <div className="text-xs text-secondary mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card rounded-card card-shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h3 text-card-foreground">Revenue Overview</h2>
            <select className="text-small bg-muted rounded-button px-3 py-1.5 border-0 outline-none text-foreground">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="flex items-end gap-2 h-48">
            {[35, 52, 41, 68, 45, 72, 58, 82, 65, 90, 78, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md gradient-primary opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-card card-shadow p-6">
          <h2 className="text-h3 text-card-foreground mb-4">Student Analytics</h2>
          <div className="space-y-4">
            {[
              { label: "New enrollments", value: "234", trend: "+12%" },
              { label: "Course completions", value: "89", trend: "+8%" },
              { label: "Active learners", value: "1,240", trend: "+5%" },
              { label: "Reviews received", value: "56", trend: "+15%" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                <span className="text-small text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-small font-semibold text-card-foreground">{item.value}</span>
                  <span className="text-xs text-secondary">{item.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Management */}
      <div className="bg-card rounded-card card-shadow">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-h3 text-card-foreground">My Courses</h2>
          <Button variant="outline" size="sm" className="rounded-button">
            <BarChart3 size={14} className="mr-2" /> View Analytics
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Course</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3 hidden md:table-cell">Students</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3 hidden md:table-cell">Rating</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Revenue</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myCourses.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                        <BookOpen size={16} className="text-primary-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-small font-medium text-card-foreground truncate max-w-[200px]">{c.title}</div>
                        <div className="text-xs text-muted-foreground">{c.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-small text-card-foreground">{c.students.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <RatingStars rating={c.rating} size={12} />
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-small font-semibold text-card-foreground">
                      ${(c.price * c.students * 0.7).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600">
                      Published
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={16} />
                      </button>
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

export default InstructorDashboard;
