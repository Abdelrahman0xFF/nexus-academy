import {
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    ExternalLink,
    BookOpen,
    Users,
    Clock,
    Star,
} from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { courses } from "@/lib/data";

const AdminCourses = () => {
    return (
        <DashboardLayout type="admin">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-h1 text-foreground font-black tracking-tight">
                        Course Inventory
                    </h1>
                    <p className="text-body text-muted-foreground mt-1">
                        Audit, edit, and moderate platform content
                    </p>
                </div>
            </div>

            {/* Filters Card */}
            <div className="bg-card rounded-card card-shadow p-5 mb-6 border border-border/50">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative max-w-md w-full">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            type="text"
                            placeholder="Search by title, instructor, or ID..."
                            className="w-full pl-10 pr-4 py-2.5 text-small bg-muted/30 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select className="flex-1 md:w-40 px-3 py-2.5 text-[11px] font-bold tracking-wider border border-border rounded-xl bg-card outline-none focus:ring-2 focus:ring-primary/20">
                            <option>All Categories</option>
                            <option>Web Development</option>
                            <option>Design</option>
                        </select>
                        <select className="flex-1 md:w-32 px-3 py-2.5 text-[11px] font-bold tracking-wider border border-border rounded-xl bg-card outline-none focus:ring-2 focus:ring-primary/20">
                            <option>Status</option>
                            <option>Published</option>
                            <option>Draft</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Modern Course Table */}
            <div className="bg-card rounded-card card-shadow overflow-hidden border border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/20">
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest">
                                    Course Information
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest">
                                    Instructor
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest">
                                    Performance
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest">
                                    Pricing
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {courses.map((course) => (
                                <tr
                                    key={course.id}
                                    className="hover:bg-muted/10 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-primary/10 shrink-0 border border-border">
                                                <img
                                                    src={course.image}
                                                    alt=""
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-small font-bold text-foreground truncate max-w-[200px] group-hover:text-primary transition-colors">
                                                    {course.title}
                                                </div>
                                                <div className="text-[10px] font-bold text-muted-foreground tracking-tighter">
                                                    {course.category}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-border">
                                                {course.instructor[0]}
                                            </div>
                                            <span className="text-xs font-bold text-foreground">
                                                {course.instructor}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground">
                                                <Users
                                                    size={12}
                                                    className="text-primary"
                                                />{" "}
                                                {course.students.toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                                                <Star
                                                    size={10}
                                                    className="text-amber-400 fill-amber-400"
                                                />{" "}
                                                {course.rating}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-small font-black text-primary">
                                            ${course.price}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 text-[10px] font-black rounded-full bg-emerald-500/10 text-emerald-600 tracking-tighter border border-emerald-500/20 shadow-sm">
                                            Published
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-xl hover:bg-muted group-hover:text-primary transition-colors"
                                                >
                                                    <MoreVertical size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-52 rounded-xl p-2 shadow-2xl"
                                            >
                                                <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 font-medium">
                                                    <Eye
                                                        size={16}
                                                        className="text-blue-500"
                                                    />{" "}
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 font-medium">
                                                    <Edit2
                                                        size={16}
                                                        className="text-primary"
                                                    />{" "}
                                                    Edit Content
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 font-medium">
                                                    <ExternalLink
                                                        size={16}
                                                        className="text-emerald-500"
                                                    />{" "}
                                                    Preview Player
                                                </DropdownMenuItem>
                                                <div className="h-px bg-border my-1" />
                                                <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 font-medium text-destructive focus:text-white focus:bg-destructive">
                                                    <Trash2 size={16} />{" "}
                                                    Unpublish Course
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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

export default AdminCourses;
