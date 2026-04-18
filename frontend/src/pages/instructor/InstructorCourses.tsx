import { BookOpen, Plus, Eye, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import RatingStars from "@/components/RatingStars";
import { courses } from "@/lib/data";
import { AppSelect } from "@/components/ui/app-select";

const InstructorCourses = () => {
  const myCourses = courses.slice(0, 4);

  return (
    <DashboardLayout type="instructor">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h1 text-foreground">My Courses</h1>
          <p className="text-body text-muted-foreground mt-1">Manage and organize your published courses</p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground rounded-button hover:opacity-90 transition-opacity">
          <Plus size={18} className="mr-2" /> New Course
        </Button>
      </div>

<<<<<<< Updated upstream
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
            options={["All Status", "Published", "Draft", "Under Review"]}
            defaultValue="All Status"
          />
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {myCourses.map((c, i) => {
          const status = i === 3 ? "Draft" : "Published";
          return (
            <div key={c.id} className="bg-card rounded-card card-shadow overflow-hidden hover-lift">
              <div className="h-36 gradient-primary flex items-center justify-center relative">
                <BookOpen size={40} className="text-primary-foreground/40" />
                <span
                  className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full ${
                    status === "Published"
                      ? "bg-emerald-500/20 text-emerald-600"
                      : "bg-amber-500/20 text-amber-600"
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-small font-semibold text-card-foreground mb-1 truncate">{c.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{c.category} · {c.level}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span>{c.students.toLocaleString()} students</span>
                  <RatingStars rating={c.rating} size={12} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-small font-bold text-primary">
                    ${(c.price * c.students * 0.7).toLocaleString(undefined, { maximumFractionDigits: 0 })} earned
                  </span>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"><Eye size={16} /></button>
                    <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"><Edit size={16} /></button>
                    <button className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
=======
      <div className="bg-card rounded-card card-shadow overflow-hidden border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                  Course Information
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                  Performance
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                  Pricing
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCourses.map(({ course: c, index: i }) => {
                const status = i % 4 === 3 ? "Draft" : "Published";
                return (
                  <tr
                    key={c.id}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border">
                          {c.image ? (
                            <img
                              src={c.image}
                              alt={c.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen
                              size={20}
                              className="text-muted-foreground/40"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-small font-bold text-foreground truncate max-w-[200px] group-hover:text-primary transition-colors">
                            {c.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {c.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-[13px] text-foreground font-medium">
                          <Users size={12} className="text-primary" />
                          {c.students.toLocaleString()}
                        </div>
                        <RatingStars
                          rating={c.rating}
                          size={10}
                          showValue={true}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] font-bold text-[#1e5a7d]">
                        ${c.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                          status === "Published"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                            >
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 p-1 rounded-card border-border shadow-xl"
                          >
                            <DropdownMenuItem
                              className="flex items-center gap-3 p-2.5 cursor-pointer rounded-md focus:bg-muted"
                              asChild
                            >
                              <Link to={`/courses/${c.id}`}>
                                <Eye size={16} className="text-[#5B6AD0]" />
                                <span className="text-small text-foreground">
                                  View Details
                                </span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-3 p-2.5 cursor-pointer rounded-md focus:bg-muted"
                              onClick={() =>
                                navigate("/instructor/upload", { state: c })
                              }
                            >
                              <Edit size={16} className="text-[#0D8A8A]" />
                              <span className="text-small text-foreground">
                                Edit Content
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-border" />
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="flex items-center gap-3 p-2.5 cursor-pointer rounded-md focus:bg-destructive/10 text-[#F24848]">
                                <Trash2 size={16} />
                                <span className="text-small font-medium">
                                  Unpublish Course
                                </span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <AlertDialogContent className="rounded-card border-border bg-card max-w-[400px]">
                          <AlertDialogHeader className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-[#72BFD9]/10 flex items-center justify-center mb-4">
                              <HelpCircle
                                className="text-[#72BFD9]"
                                size={24}
                              />
                            </div>
                            <AlertDialogTitle className="text-h3 text-[#1A1F2C]">
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-body text-[#606977]">
                              This action cannot be undone. This will
                              permanently delete the course from the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex sm:justify-center gap-3 mt-4">
                            <AlertDialogCancel className="rounded-button border-[#E2E8F0] bg-white text-[#606977] hover:bg-[#F5F5F5] flex-1">
                              No, Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(c.id)}
                              className="rounded-button bg-[#F24848] text-white hover:bg-[#D93D3D] border-0 flex-1"
                            >
                              Yes, Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
>>>>>>> Stashed changes
      </div>
    </DashboardLayout>
  );
};

export default InstructorCourses;
