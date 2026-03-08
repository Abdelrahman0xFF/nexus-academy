import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import { courses } from "@/lib/data";

const InstructorRevenue = () => {
  const transactions = [
    { id: 1, student: "David Martinez", course: "Complete Web Development Bootcamp 2025", amount: 49.99, date: "Mar 7, 2025", type: "sale" },
    { id: 2, student: "Priya Sharma", course: "Machine Learning & AI Masterclass", amount: 59.99, date: "Mar 6, 2025", type: "sale" },
    { id: 3, student: "Platform", course: "Monthly Payout", amount: -2480.00, date: "Mar 1, 2025", type: "payout" },
    { id: 4, student: "Tom Anderson", course: "Complete Web Development Bootcamp 2025", amount: 49.99, date: "Feb 28, 2025", type: "sale" },
    { id: 5, student: "Maria Garcia", course: "Advanced React & TypeScript Patterns", amount: 54.99, date: "Feb 27, 2025", type: "sale" },
    { id: 6, student: "James Lee", course: "Machine Learning & AI Masterclass", amount: -59.99, date: "Feb 25, 2025", type: "refund" },
  ];

  return (
    <DashboardLayout type="instructor">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h1 text-foreground">Revenue</h1>
          <p className="text-body text-muted-foreground mt-1">Track your earnings and payouts</p>
        </div>
        <Button variant="outline" className="rounded-button">
          <CreditCard size={16} className="mr-2" /> Request Payout
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: "$12,480", change: "+18%", up: true },
          { label: "This Month", value: "$2,340", change: "+24%", up: true },
          { label: "Pending Payout", value: "$1,890", change: "", up: true },
          { label: "Refunds", value: "$120", change: "-5%", up: false },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-card card-shadow p-5">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={16} className="text-primary" />
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
        ))}
      </div>

      {/* Revenue by Course */}
      <div className="bg-card rounded-card card-shadow p-6 mb-8">
        <h2 className="text-h3 text-card-foreground mb-5">Revenue by Course</h2>
        <div className="space-y-4">
          {courses.slice(0, 4).map((c) => {
            const revenue = Math.round(c.price * c.students * 0.7);
            const maxRevenue = Math.round(courses[0].price * courses[0].students * 0.7);
            const percentage = (revenue / maxRevenue) * 100;
            return (
              <div key={c.id}>
                <div className="flex items-center justify-between text-small mb-1.5">
                  <span className="font-medium text-card-foreground truncate mr-4">{c.title}</span>
                  <span className="font-bold text-primary shrink-0">${revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card rounded-card card-shadow">
        <div className="p-6 border-b border-border">
          <h2 className="text-h3 text-card-foreground">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Description</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Type</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase px-6 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-small font-medium text-card-foreground">{t.student}</div>
                    <div className="text-xs text-muted-foreground">{t.course}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-small text-muted-foreground">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      t.type === "sale" ? "bg-emerald-500/10 text-emerald-600" :
                      t.type === "payout" ? "bg-primary/10 text-primary" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-small font-semibold ${t.amount >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                      {t.amount >= 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                    </span>
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

export default InstructorRevenue;
