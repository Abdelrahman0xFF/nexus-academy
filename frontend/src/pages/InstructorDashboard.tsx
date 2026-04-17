import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import RatingStars from "@/components/RatingStars";
import { AppSelect } from "@/components/ui/app-select";
import { courses as initialCourses } from "@/lib/data";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const InstructorDashboard = () => {
  const [coursesList, setCoursesList] = useState(initialCourses.slice(0, 4));
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    setCoursesList(coursesList.filter((c) => c.id !== id));
  };
  return (
    <DashboardLayout type="instructor">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h1 text-foreground">Instructor Dashboard</h1>
          <p className="text-body text-muted-foreground mt-1">
            Manage your courses and track performance
          </p>
        </div>
        <Button
          asChild
          className="gradient-primary border-0 text-primary-foreground rounded-button hover:opacity-90 transition-opacity"
        >
          <Link to="/instructor/upload">
            <Plus size={18} className="mr-2" /> Create Course
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: BookOpen,
            label: "Total Courses",
            value: "4",
            trend: "+1 this month",
            trendUp: true,
            color: "bg-primary/10 text-primary",
          },
          {
            icon: Users,
            label: "Total Students",
            value: "45,820",
            trend: "+2.4k this month",
            trendUp: true,
            color: "bg-secondary/10 text-secondary",
          },
          {
            icon: DollarSign,
            label: "Revenue",
            value: "$12,480",
            trend: "+18% vs last month",
            trendUp: true,
            color: "bg-emerald-500/10 text-emerald-600",
          },
          {
            icon: TrendingUp,
            label: "Avg. Rating",
            value: "4.85",
            trend: "Top 5% instructor",
            trendUp: null,
            color: "bg-amber-500/10 text-amber-600",
          },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-card card-shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}
              >
                <s.icon size={20} />
              </div>
              {s.trendUp === true && (
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingUp size={12} />
                  <span>{s.trend}</span>
                </div>
              )}
              {s.trendUp === false && (
                <div className="flex items-center gap-1 text-xs font-medium text-destructive">
                  <TrendingDown size={12} />
                  <span>{s.trend}</span>
                </div>
              )}
              {s.trendUp === null && (
                <div className="text-xs font-medium text-muted-foreground">
                  {s.trend}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-card-foreground">
              {s.value}
            </div>
            <div className="text-small text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card rounded-card card-shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h3 text-card-foreground">Revenue Overview</h2>
            <AppSelect
              options={["Last 7 days", "Last 30 days", "Last 90 days"]}
              defaultValue="Last 7 days"
              className="w-auto"
            />
          </div>
          <div className="flex items-end gap-2 h-48">
            {[35, 52, 41, 68, 45, 72, 58, 82, 65, 90, 78, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md gradient-primary opacity-90 hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-y-105 origin-bottom transform"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {
                    [
                      "J",
                      "F",
                      "M",
                      "A",
                      "M",
                      "J",
                      "J",
                      "A",
                      "S",
                      "O",
                      "N",
                      "D",
                    ][i]
                  }
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-card card-shadow p-6">
          <h2 className="text-h3 text-card-foreground mb-4">
            Student Analytics
          </h2>
          <div className="space-y-4">
            {[
              {
                label: "New enrollments",
                value: "234",
                trend: "+12%",
                trendUp: true,
              },
              {
                label: "Course completions",
                value: "89",
                trend: "+8%",
                trendUp: true,
              },
              {
                label: "Active learners",
                value: "1,240",
                trend: "+5%",
                trendUp: true,
              },
              {
                label: "Reviews received",
                value: "56",
                trend: "+15%",
                trendUp: true,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
              >
                <span className="text-small text-muted-foreground">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-small font-semibold text-card-foreground">
                    {item.value}
                  </span>
                  {item.trendUp && (
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp size={10} /> {item.trend}
                    </span>
                  )}
                  {item.trendUp === false && (
                    <span className="text-xs font-medium text-destructive flex items-center gap-0.5">
                      <TrendingDown size={10} /> {item.trend}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Management Table */}
      <div className="bg-card rounded-card card-shadow">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-h3 text-card-foreground">My Courses</h2>
          <Link to="/instructor/Courses">
            <Button variant="outline" size="sm" className="rounded-button">
              <BookOpen size={14} className="mr-2" /> View all courses
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left text-[10px] font-black text-muted-foreground tracking-widest px-6 py-4">
                  Course
                </th>
                <th className="text-left text-[10px] font-black text-muted-foreground tracking-widest px-6 py-4 hidden md:table-cell">
                  Students
                </th>
                <th className="text-left text-[10px] font-black text-muted-foreground tracking-widest px-6 py-4 hidden md:table-cell">
                  Rating
                </th>
                <th className="text-left text-[10px] font-black text-muted-foreground tracking-widest px-6 py-4 hidden lg:table-cell">
                  Revenue
                </th>
                <th className="text-left text-[10px] font-black text-muted-foreground tracking-widest px-6 py-4">
                  Status
                </th>
                <th className="text-right text-[10px] font-black text-muted-foreground tracking-widest px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {coursesList.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                        <BookOpen
                          size={16}
                          className="text-primary-foreground"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-small font-medium text-card-foreground truncate max-w-[200px] group-hover:text-primary transition-colors">
                          {c.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {c.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-small text-card-foreground">
                      {c.students.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <RatingStars
                      showValue={false}
                      rating={c.rating}
                      size={12}
                    />
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-small font-semibold text-card-foreground">
                      $
                      {(c.price * c.students * 0.7).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-[10px] font-black rounded-full bg-emerald-500/10 text-emerald-600 tracking-tighter border border-emerald-500/20 shadow-sm">
                      Published
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/courses/${c.id}`}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground group-hover:text-primary transition-colors"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() =>
                          navigate("/instructor/upload", { state: c })
                        }
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground group-hover:text-primary transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="p-1.5 rounded-md hover:bg-[#F24848]/10 text-muted-foreground hover:text-[#F24848] transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="rounded-card border-border bg-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-h3 text-[#1A1F2C]">
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-body text-[#606977]">
                              This action cannot be undone. This will
                              permanently delete the course and remove its data
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter className="gap-2">
                            <AlertDialogCancel className="rounded-button border-[#E2E8F0] bg-white text-[#606977] hover:bg-[#F5F5F5] transition-colors">
                              No, Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() => handleDelete(c.id)}
                              className="rounded-button bg-[#F24848] text-white hover:bg-[#D93D3D] transition-opacity border-0"
                            >
                              Yes, Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
