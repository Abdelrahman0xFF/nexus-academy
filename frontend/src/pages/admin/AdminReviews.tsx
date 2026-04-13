import { useState } from "react";
import { Search, Trash2, Star, MessageSquare, ShieldAlert } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { initialReviews, courses, Review } from "@/lib/data";
import RatingStars from "@/components/RatingStars";
import { toast } from "sonner";

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const handleDelete = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
    toast.success("Review deleted successfully");
  };

  return (
    <DashboardLayout type="admin">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">Review Management</h1>
        <p className="text-body text-muted-foreground mt-1">Monitor and moderate course feedback</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Reviews", value: reviews.length, icon: MessageSquare, color: "bg-primary/10 text-primary" },
          { label: "Avg. Rating", value: "4.8/5", icon: Star, color: "bg-amber-500/10 text-amber-600" },
          { label: "Flagged", value: "0", icon: ShieldAlert, color: "bg-destructive/10 text-destructive" },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-card card-shadow p-6 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                <s.icon size={24} />
              </div>
              <div>
                <div className="text-small text-muted-foreground font-medium">{s.label}</div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-card card-shadow overflow-hidden border border-border/50">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h3 className="text-body font-bold text-foreground">Recent Feedback</h3>
            <div className="relative max-w-xs w-full">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Filter reviews..."
                    className="w-full pl-9 pr-4 py-1.5 text-xs bg-muted/50 rounded-button border border-border outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Comment</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((review) => {
                const course = courses.find(c => c.id === review.courseId);
                return (
                  <tr key={review.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                          {review.userName[0]}
                        </div>
                        <span className="text-xs font-semibold text-foreground">{review.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[11px] font-medium text-foreground truncate max-w-[150px]">
                        {course?.title || "Unknown Course"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RatingStars rating={review.rating} size={12} showValue={false} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[200px]">
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-muted-foreground">{review.date}</td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReviews;
