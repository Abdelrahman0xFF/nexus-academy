import {
    Search,
    Download,
    TrendingUp,
    DollarSign,
    Users,
    BookOpen,
    ArrowUpRight,
    CreditCard,
    Calendar,
} from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";

const AdminPayments = () => {
    const transactions = [
        {
            id: "TX-94021",
            user: "Abdelrahman Ashraf",
            course: "Complete Web Dev",
            amount: 49.99,
            date: "May 12, 2025",
            method: "Visa",
            status: "Successful",
        },
        {
            id: "TX-94022",
            user: "John Doe",
            course: "Data Science Masterclass",
            amount: 59.99,
            date: "May 11, 2025",
            method: "Mastercard",
            status: "Successful",
        },
        {
            id: "TX-94023",
            user: "Sarah Miller",
            course: "UI/UX Design",
            amount: 39.99,
            date: "May 10, 2025",
            method: "PayPal",
            status: "Refunded",
        },
        {
            id: "TX-94024",
            user: "Michael Chen",
            course: "React Patterns",
            amount: 54.99,
            date: "May 10, 2025",
            method: "Visa",
            status: "Successful",
        },
    ];

    return (
        <DashboardLayout type="admin">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-h1 text-foreground font-black tracking-tight">
                        Financial Hub
                    </h1>
                    <p className="text-body text-muted-foreground mt-1">
                        Monitor revenue streams and transaction history
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    {
                        label: "Total Revenue",
                        value: "$124,592",
                        icon: DollarSign,
                        color: "text-emerald-600",
                        bg: "bg-emerald-50",
                        trend: "+14.2%",
                    },
                    {
                        label: "Sales Count",
                        value: "2,405",
                        icon: BookOpen,
                        color: "text-primary",
                        bg: "bg-primary/10",
                        trend: "+8.1%",
                    },
                    {
                        label: "Refunded",
                        value: "$1,240",
                        icon: TrendingUp,
                        color: "text-destructive",
                        bg: "bg-destructive/10",
                        trend: "-2.4%",
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        className="bg-card rounded-card card-shadow p-6 hover-lift border border-border/50"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}
                            >
                                <s.icon size={24} />
                            </div>
                            <div
                                className={`text-[10px] font-black px-2 py-1 rounded-full ${s.trend.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-destructive/10 text-destructive"}`}
                            >
                                {s.trend}
                            </div>
                        </div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                            {s.label}
                        </div>
                        <div className="text-2xl font-black text-foreground">
                            {s.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Transactions Table */}
            <div className="bg-card rounded-card card-shadow overflow-hidden border border-border/50">
                <div className="p-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <h3 className="text-small font-black text-foreground uppercase tracking-widest">
                        Recent Transactions
                    </h3>
                    <div className="relative max-w-xs w-full">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            type="text"
                            placeholder="Search by ID or User..."
                            className="w-full pl-9 pr-4 py-2 text-xs bg-card rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/10">
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    Transaction ID
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    Customer Details
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    Method
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">
                                    View
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {transactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    className="hover:bg-muted/10 transition-colors group"
                                >
                                    <td className="px-6 py-4 text-xs font-bold text-foreground font-mono">
                                        {tx.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-small font-bold text-foreground group-hover:text-primary transition-colors">
                                            {tx.user}
                                        </div>
                                        <div className="text-[10px] font-medium text-muted-foreground truncate max-w-[180px]">
                                            {tx.course}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-small font-black text-foreground">
                                        ${tx.amount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <CreditCard
                                                size={14}
                                                className="text-primary"
                                            />{" "}
                                            {tx.method}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter border shadow-sm ${
                                                tx.status === "Successful"
                                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                    : "bg-destructive/10 text-destructive border-destructive/20"
                                            }`}
                                        >
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-xl hover:bg-muted group-hover:text-primary transition-all"
                                        >
                                            <ArrowUpRight size={18} />
                                        </Button>
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

export default AdminPayments;
