import {
    Search,
    MoreVertical,
    Shield,
    Trash2,
    UserCheck,
    Activity,
    Mail,
} from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminUsers = () => {
    const users = [
        {
            id: "1",
            name: "Abdelrahman Ashraf",
            email: "abdelrahman@example.com",
            role: "Admin",
            joined: "Jan 12, 2024",
            status: "Active",
        },
        {
            id: "2",
            name: "Sarah Miller",
            email: "sarah@example.com",
            role: "Instructor",
            joined: "Feb 05, 2024",
            status: "Active",
        },
        {
            id: "3",
            name: "John Doe",
            email: "john@example.com",
            role: "Student",
            joined: "Mar 20, 2024",
            status: "Inactive",
        },
        {
            id: "4",
            name: "Michael Chen",
            email: "michael@example.com",
            role: "Instructor",
            joined: "Apr 15, 2024",
            status: "Active",
        },
    ];

    return (
        <DashboardLayout type="admin">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-h1 text-foreground">User Management</h1>
                    <p className="text-body text-muted-foreground mt-1">
                        Manage platform users, roles, and access levels
                    </p>
                </div>
                <Button className="gradient-primary border-0 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                    Add New User
                </Button>
            </div>

            {/* Filters Card */}
            <div className="bg-card rounded-card card-shadow p-4 mb-6 border border-border/50">
                <div className="relative max-w-md">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2.5 text-small bg-muted/30 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            {/* Modern Data Table */}
            <div className="bg-card rounded-card card-shadow overflow-hidden border border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/20">
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest">
                                    User Details
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest">
                                    Joined Date
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
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-muted/10 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-black shadow-sm group-hover:scale-110 transition-transform">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <div className="text-small font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {user.name}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                    <Mail size={10} />{" "}
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 text-[10px] font-black rounded-full tracking-tighter shadow-sm ${
                                                user.role === "Admin"
                                                    ? "bg-indigo-500 text-white"
                                                    : user.role === "Instructor"
                                                      ? "bg-primary text-white"
                                                      : "bg-slate-500 text-white"
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                                        {user.joined}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-2 h-2 rounded-full animate-pulse ${user.status === "Active" ? "bg-emerald-500" : "bg-slate-300"}`}
                                            />
                                            <span className="text-[11px] font-black text-slate-600">
                                                {user.status}
                                            </span>
                                        </div>
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
                                                    <UserCheck
                                                        size={16}
                                                        className="text-emerald-500"
                                                    />{" "}
                                                    Edit Permissions
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 font-medium">
                                                    <Shield
                                                        size={16}
                                                        className="text-blue-500"
                                                    />{" "}
                                                    Change Role
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 font-medium">
                                                    <Activity
                                                        size={16}
                                                        className="text-primary"
                                                    />{" "}
                                                    View Activity
                                                </DropdownMenuItem>
                                                <div className="h-px bg-border my-1" />
                                                <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 font-medium text-destructive focus:text-white focus:bg-destructive">
                                                    <Trash2 size={16} /> Delete
                                                    User
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

export default AdminUsers;
