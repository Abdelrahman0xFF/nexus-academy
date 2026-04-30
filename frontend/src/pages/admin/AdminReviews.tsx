import { Loader2, Search, Eye, ShieldAlert, Star, Trash2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/lib/reviews-api";
import { coursesApi } from "@/lib/courses-api";
import RatingStars from "@/components/RatingStars";
import { getMediaUrl } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AppSelect } from "@/components/ui/app-select";
import { Button } from "@/components/ui/button";
import { AppPagination } from "@/components/ui/app-pagination";
import { toast } from "sonner";
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

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const AdminReviews = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [courseFilter, setCourseFilter] = useState("Select a Course");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: coursesData } = useQuery({
        queryKey: ["admin-all-courses"],
        queryFn: () => coursesApi.getAll({ page: 1, limit: 100 }),
    });

    const courses = coursesData?.courses || [];

    const selectedCourseId =
        courseFilter === "Select a Course"
            ? undefined
            : courses.find((c) => c.title === courseFilter)?.course_id;

    const { data: reviewsRes, isLoading } = useQuery({
        queryKey: ["admin-course-reviews", selectedCourseId, page],
        queryFn: () =>
            selectedCourseId 
                ? reviewApi.getByCourse(selectedCourseId, { page, limit })
                : Promise.resolve({ reviews: [], total: 0 }),
        enabled: !!selectedCourseId,
    });

    const deleteMutation = useMutation({
        mutationFn: ({ courseId, userId }: { courseId: number; userId: number }) => {
            return reviewApi.delete(courseId, { user_id: userId } as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-course-reviews"] });
            toast.success("Review deleted successfully");
            setIsDialogOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete review");
        },
    });

    const reviews = reviewsRes?.reviews || [];
    const total = reviewsRes?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const courseOptions = ["Select a Course", ...courses.map((c) => c.title)];

    const stats = [
        { label: "Total Audited", value: total, icon: Star, color: "bg-primary/10 text-primary" },
        { label: "Flagged", value: "0", icon: ShieldAlert, color: "bg-destructive/10 text-destructive" },
    ];

    return (
        <DashboardLayout type="admin">
            <div className="mb-8">
                <h1 className="text-h1 text-foreground font-black tracking-tight">Review Moderation</h1>
                <p className="text-body text-muted-foreground mt-1">Audit, moderate, and manage student feedback across the platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {stats.map((s, i) => (
                    <div key={i} className="bg-card rounded-card card-shadow p-6 transition-all hover:scale-[1.02] border border-border/50">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                                <s.icon size={24} />
                            </div>
                            <div>
                                <div className="text-small text-muted-foreground font-medium uppercase tracking-widest text-[10px]">{s.label}</div>
                                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-card rounded-card card-shadow p-6 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between border border-border/50">
                <div className="flex-1 w-full">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Select Course to Moderate</label>
                    <AppSelect
                        options={courseOptions}
                        value={courseFilter}
                        onValueChange={(val) => {
                            setCourseFilter(val);
                            setPage(1);
                        }}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-card card-shadow overflow-hidden border border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/20">
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                                    Student
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                                    Rating
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest uppercase hidden lg:table-cell">
                                    Feedback
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest uppercase hidden sm:table-cell">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground tracking-widest uppercase text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {!selectedCourseId ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-20 text-muted-foreground">
                                        Please select a course to view reviews.
                                    </td>
                                </tr>
                            ) : isLoading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center py-12"
                                    >
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                    </td>
                                </tr>
                            ) : reviews.length > 0 ? (
                                reviews.map((r, i) => (
                                    <tr key={i} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shrink-0 overflow-hidden border border-border shadow-sm">
                                                    {r.avatar_url ? (
                                                        <img
                                                            src={getMediaUrl(r.avatar_url)}
                                                            alt={r.first_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-[10px] font-black text-primary-foreground uppercase">
                                                            {r.first_name?.[0]}{r.last_name?.[0]}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-small font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                                        {r.first_name} {r.last_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <RatingStars
                                                rating={r.rating}
                                                showValue={false}
                                                size={10}
                                            />
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell max-w-xs">
                                            <p className="text-[11px] text-muted-foreground italic line-clamp-2 leading-relaxed max-w-[300px]">
                                                "{r.comment}"
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell whitespace-nowrap">
                                            <div className="text-small font-medium text-muted-foreground">
                                                {new Date(r.reviewed_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:bg-primary/10 hover:text-primary transition-colors h-8 w-8"
                                                    onClick={() => {
                                                        setSelectedReview(r);
                                                        setIsDialogOpen(true);
                                                    }}
                                                    title="View Full Message"
                                                >
                                                    <Eye size={16} />
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-destructive/10 hover:text-destructive transition-colors h-8 w-8"
                                                            title="Delete Review"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-card border-border bg-card">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-h3">Delete Review?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-body">
                                                                Are you sure you want to remove this feedback? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="rounded-button">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                className="rounded-button bg-destructive hover:bg-destructive/90"
                                                                onClick={() => deleteMutation.mutate({ courseId: r.course_id, userId: r.user_id })}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center py-20 text-muted-foreground"
                                    >
                                        No reviews found for this course.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {total > limit && (
                <AppPagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                />
            )}

            {/* Dialog for Full Message */}
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setSelectedReview(null);
                }}
            >
                <DialogContent className="rounded-card border-border bg-card">
                    {selectedReview && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-h3">
                                    Feedback from {selectedReview.first_name} {selectedReview.last_name}
                                </DialogTitle>
                                <DialogDescription className="text-body">
                                    Full student feedback for moderation audit
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col gap-4 mt-2">
                                <div className="flex items-center justify-between">
                                    <RatingStars
                                        rating={selectedReview.rating}
                                        showValue={true}
                                    />
                                    <span className="text-[10px] font-black text-muted-foreground uppercase">
                                        {new Date(selectedReview.reviewed_at).toLocaleString()}
                                    </span>
                                </div>

                                <div className="bg-muted/30 p-5 rounded-xl text-sm italic border border-border leading-relaxed">
                                    "{selectedReview.comment}"
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                   <div className="flex gap-2">
                                       <Button 
                                            variant="destructive" 
                                            className="rounded-button" 
                                            onClick={() => {
                                                toast.info("Moderation report filed. Action pending backend audit.");
                                            }}
                                       >
                                           <ShieldAlert size={16} className="mr-2" /> Flag Content
                                       </Button>
                                   </div>
                                   <div className="flex gap-2">
                                       <Button variant="outline" className="rounded-button" onClick={() => setIsDialogOpen(false)}>Close</Button>
                                       <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" className="rounded-button text-destructive hover:bg-destructive/10">Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                                    <AlertDialogDescription>Delete this student feedback permanently?</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        className="bg-destructive"
                                                        onClick={() => deleteMutation.mutate({ courseId: selectedReview.course_id, userId: selectedReview.user_id })}
                                                    >
                                                        Yes, Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                       </AlertDialog>
                                   </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default AdminReviews;
