import {
    Users,
    BookOpen,
    DollarSign,
    ArrowUpRight,
    Clock,
    Star,
    ShieldCheck,
    Activity,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";

const AdminOverview = () => {
    const stats = [
        {
            label: "Total Students",
            value: "12,482",
            icon: Users,
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            label: "Total Revenue",
            value: "$84,250",
            icon: DollarSign,
            color: "text-secondary",
            bg: "bg-secondary/10",
        },
        {
            label: "Active Courses",
            value: "145",
            icon: BookOpen,
            color: "text-amber-600",
            bg: "bg-amber-500/10",
        },
        {
            label: "Avg. Rating",
            value: "4.8",
            icon: Star,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10",
        },
    ];

    const recentActivities = [
        {
            id: 1,
            type: "user",
            text: "New instructor registration: Sarah Miller",
            time: "2 hours ago",
        },
        {
            id: 2,
            type: "payment",
            text: "Successful payment of $49.99 from John D.",
            time: "4 hours ago",
        },
        {
            id: 3,
            type: "course",
            text: "Course 'Advanced React' approved by Admin",
            time: "5 hours ago",
        },
        {
            id: 4,
            type: "review",
            text: "New 5-star review on 'Python Masterclass'",
            time: "Yesterday",
        },
    ];

    return (
        <DashboardLayout type="admin">
            {/* Header - Catchy Greeting */}
            <div className="mb-8">
                <h1 className="text-h1 text-foreground">
                    Admin Command Center
                </h1>
                <p className="text-body text-muted-foreground mt-1">
                    Real-time platform insights and oversight
                </p>
            </div>

            {/* Stats Grid - Matching Student/Inst Style */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="bg-card rounded-card card-shadow p-5 hover-lift"
                    >
                        <div
                            className={`w-10 h-10 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-3`}
                        >
                            <s.icon size={20} />
                        </div>
                        <div className="text-2xl font-bold text-card-foreground">
                            {s.value}
                        </div>
                        <div className="text-small text-muted-foreground">
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity - Catchy List Style */}
                <div className="lg:col-span-2">
                    <div className="bg-card rounded-card card-shadow p-6 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-h3 text-card-foreground flex items-center gap-2">
                                <Activity size={20} className="text-primary" />{" "}
                                Recent Activity
                            </h2>
                            <Link
                                to="/admin/logs"
                                className="text-primary text-small font-medium hover:underline flex items-center gap-1"
                            >
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group border border-transparent hover:border-border"
                                >
                                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                                        {activity.type === "user" ? (
                                            <Users
                                                size={20}
                                                className="text-white"
                                            />
                                        ) : (
                                            <DollarSign
                                                size={20}
                                                className="text-white"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-small font-semibold text-card-foreground truncate group-hover:text-primary transition-colors">
                                            {activity.text}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {activity.time}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full text-muted-foreground"
                                    >
                                        <ArrowUpRight size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Health Card - Catchy Sidebar Style */}
                <div className="space-y-6">
                    <div className="bg-card rounded-card card-shadow p-6 border-t-4 border-primary">
                        <h2 className="text-body font-bold text-foreground mb-6">
                            System Health
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={18} />
                                    <span className="text-xs font-bold">
                                        API Status
                                    </span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-tighter">
                                    Healthy
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <Clock size={18} />
                                    <span className="text-xs font-bold">
                                        Last Backup
                                    </span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-tighter">
                                    Recent
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                <span>Storage Usage</span>
                                <span className="text-primary">82%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full gradient-primary w-[82%] transition-all duration-1000" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminOverview;
