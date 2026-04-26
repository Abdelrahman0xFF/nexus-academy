import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Star,
    Clock,
    BookOpen,
    Users,
    Globe,
    Award,
    PlayCircle,
    CheckCircle,
    ChevronRight,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";
import RatingStars from "@/components/RatingStars";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { coursesApi } from "@/lib/courses-api";
import { reviewApi, InstructorReview, Review } from "@/lib/reviews-api";
import { enrollmentApi } from "@/lib/enrollment-api";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMediaUrl } from "@/lib/utils";
import { api, ApiResponse } from "@/lib/api-client";
import { toast } from "sonner";

const CourseDetails = () => {
    const { id } = useParams();
    const courseId = Number(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // const [isEnrolling, setIsEnrolling] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userRating, setUserReviewRating] = useState(5);
    const [userComment, setUserComment] = useState("");
    const [isEditingReview, setIsEditingReview] = useState(false);

    const { data: courseRes, isLoading: isCourseLoading } = useQuery({
        queryKey: ["course", courseId],
        queryFn: () => coursesApi.getById(courseId),
        enabled: !!courseId,
    });

    const course = courseRes;

    const { data: contentRes, isLoading: isContentLoading } = useQuery({
        queryKey: ["course-content", courseId],
        queryFn: () => coursesApi.getContent(courseId),
        enabled: !!courseId,
    });

    const content = contentRes?.data;

    const { data: reviewsRes, isLoading: isReviewsLoading } = useQuery({
        queryKey: ["course-reviews", courseId],
        queryFn: () => reviewApi.getByCourse(courseId),
        enabled: !!courseId,
    });

    const reviews = reviewsRes?.reviews || [];

    const { data: userReviewRes } = useQuery({
        queryKey: ["user-review", courseId],
        queryFn: () =>
            api.get<any, ApiResponse<Review>>(`/reviews/${courseId}/me`),
        enabled: !!user && !!courseId && !!course?.is_enrolled,
    });

    useEffect(() => {
        if (userReviewRes?.success && userReviewRes.data) {
            setUserReviewRating(userReviewRes.data.rating);
            setUserComment(userReviewRes.data.comment);
            setIsEditingReview(true);
        }
    }, [userReviewRes]);

    const enrollMutation = useMutation({
        mutationFn: () => enrollmentApi.enroll(courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", courseId] });
            toast.success("Enrolled successfully!");
            navigate(`/learn/${courseId}/1/1`);
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to enroll");
        },
    });

    const reviewMutation = useMutation({
        mutationFn: (data: any) =>
            isEditingReview
                ? reviewApi.update(courseId, data)
                : reviewApi.create(courseId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["course-reviews", courseId],
            });
            queryClient.invalidateQueries({ queryKey: ["user-review", courseId] });
            toast.success(
                isEditingReview ? "Review updated!" : "Review posted!",
            );
            setShowReviewForm(false);
        },
    });

    const handleEnroll = () => {
        if (!user) {
            navigate("/login", { state: { from: { pathname: window.location.pathname } } });
            return;
        }
        if (course?.is_enrolled) {
            navigate(`/learn/${courseId}/1/1`);
            return;
        }
        enrollMutation.mutate();
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        reviewMutation.mutate({ rating: userRating, comment: userComment });
    };

    if (isCourseLoading || !course || !content) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            </MainLayout>
        );
    }

    const isEnrolling = enrollMutation.isPending;

    return (
        <MainLayout>
            <div className="bg-card min-h-screen">
                {/* Hero Section */}
                <div className="gradient-primary text-primary-foreground py-12 lg:py-20 animate-in fade-in duration-700">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="grid lg:grid-cols-3 gap-12 items-start">
                            <div className="lg:col-span-2 animate-in fade-in slide-in-from-left-8 duration-700 delay-200 fill-mode-both">
                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                    <Link
                                        to="/courses"
                                        className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                                    >
                                        Courses
                                    </Link>
                                    <ChevronRight
                                        size={14}
                                        className="text-primary-foreground/40"
                                    />
                                    <span className="text-primary-foreground/90 font-medium">
                                        {course.category_name}
                                    </span>
                                </div>
                                <h1 className="text-h1 lg:text-5xl font-black mb-6 leading-tight">
                                    {course.title}
                                </h1>
                                <p className="text-lg lg:text-xl text-primary-foreground/80 mb-8 max-w-2xl leading-relaxed">
                                    {course.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <RatingStars
                                        rating={course.rating}
                                        reviewCount={course.review_count || 0}
                                        size={16}
                                    />
                                    <span className="flex items-center gap-1 text-small text-primary-foreground/70">
                                        <Users size={14} />{" "}
                                        {(
                                            course.students_count || 0
                                        ).toLocaleString()}{" "}
                                        students
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 group cursor-default">
                                    <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                                        {course.instructor_avatar ? (
                                            <img
                                                src={getMediaUrl(
                                                    course.instructor_avatar,
                                                )}
                                                alt={course.instructor_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-small font-bold">
                                                {course.instructor_name
                                                    ?.split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-small font-medium text-primary-foreground group-hover:text-white transition-colors">
                                            {course.instructor_name}
                                        </div>
                                        <div className="text-xs text-primary-foreground/60">
                                            Instructor
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Card */}
                            <div className="lg:col-span-1 animate-in fade-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
                                <div className="bg-card rounded-card shadow-2xl overflow-hidden sticky top-24 border border-border/50 group hover:shadow-primary/10 transition-all duration-500">
                                    <div className="aspect-video relative overflow-hidden">
                                        {course.thumbnail_url ? (
                                            <img
                                                src={getMediaUrl(
                                                    course.thumbnail_url,
                                                )}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <BookOpen
                                                    size={48}
                                                    className="text-muted-foreground/20"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center animate-pulse">
                                                <PlayCircle size={40} className="text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="text-4xl font-black text-foreground">
                                                $
                                                {course.price ??
                                                    course.original_price}
                                            </span>
                                            {course.price !== null &&
                                                course.price <
                                                    course.original_price && (
                                                    <span className="text-lg text-muted-foreground line-through">
                                                        ${course.original_price}
                                                    </span>
                                                )}
                                        </div>

                                        <Button
                                            onClick={handleEnroll}
                                            disabled={isEnrolling}
                                            className="w-full gradient-primary border-0 text-primary-foreground py-7 rounded-button font-black text-lg mb-4 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20"
                                        >
                                            {isEnrolling ? (
                                                <Loader2 className="animate-spin mr-2" />
                                            ) : course.is_enrolled ? (
                                                "Go to Course"
                                            ) : (
                                                "Enroll Now"
                                            )}
                                        </Button>

                                        <p className="text-[10px] text-muted-foreground text-center mb-8 uppercase font-bold tracking-widest">
                                            30-day money-back guarantee
                                        </p>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-foreground uppercase tracking-widest mb-4">
                                                This course includes:
                                            </h4>
                                            {[
                                                {
                                                    icon: Clock,
                                                    label: `${course.duration} minutes of video`,
                                                },
                                                {
                                                    icon: BookOpen,
                                                    label: "Full lifetime access",
                                                },
                                                {
                                                    icon: Globe,
                                                    label: "Access on mobile and TV",
                                                },
                                                {
                                                    icon: Award,
                                                    label: "Certificate of completion",
                                                },
                                            ].map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-3 text-small text-muted-foreground group/item"
                                                >
                                                    <item.icon
                                                        size={16}
                                                        className="text-primary group-hover/item:scale-110 transition-transform"
                                                    />
                                                    <span>{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4 lg:px-8 py-16">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            {/* Course Content */}
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 fill-mode-both">
                                <h2 className="text-h2 text-foreground mb-6">
                                    Course Content
                                </h2>
                                <div className="space-y-3">
                                    {content.sections.map((section, idx) => (
                                        <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both" style={{ animationDelay: `${idx * 50 + 500}ms` }}>
                                            <Accordion
                                                type="single"
                                                collapsible
                                                className="bg-card rounded-card card-shadow border border-border/50 overflow-hidden hover:border-primary/20 transition-colors"
                                            >
                                                <AccordionItem
                                                    value={`section-${idx}`}
                                                    className="border-0"
                                                >
                                                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30 transition-colors group">
                                                        <div className="flex flex-col items-start gap-1">
                                                            <span className="text-small font-black text-foreground group-hover:text-primary transition-colors">
                                                                {section.title}
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                                                {section.lessons.length}{" "}
                                                                lessons ·{" "}
                                                                {section.lessons.reduce(
                                                                    (a, b) =>
                                                                        a +
                                                                        (b.duration ||
                                                                            0),
                                                                    0,
                                                                )}{" "}
                                                                min
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-6 pb-4 pt-2">
                                                        <div className="space-y-1">
                                                            {section.lessons.map(
                                                                (lesson, lIdx) => (
                                                                    <div
                                                                        key={lIdx}
                                                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group/lesson"
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            {lesson.is_completed ? (
                                                                                <CheckCircle
                                                                                    size={16}
                                                                                    className="text-emerald-500"
                                                                                />
                                                                            ) : (
                                                                                <PlayCircle
                                                                                    size={16}
                                                                                    className="text-muted-foreground group-hover/lesson:text-primary transition-colors"
                                                                                />
                                                                            )}
                                                                            <span className="text-small font-medium text-foreground group-hover/lesson:text-primary transition-colors">
                                                                                {
                                                                                    lesson.title
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-[11px] text-muted-foreground tabular-nums">
                                                                            {
                                                                                lesson.duration
                                                                            }{" "}
                                                                            min
                                                                        </span>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Instructor */}
                            <div className="bg-card rounded-card card-shadow p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both group">
                                <h2 className="text-h3 text-card-foreground mb-4">
                                    Your Instructor
                                </h2>
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shrink-0 overflow-hidden transition-transform group-hover:scale-110">
                                        {course.instructor_avatar ? (
                                            <img
                                                src={getMediaUrl(
                                                    course.instructor_avatar,
                                                )}
                                                alt={course.instructor_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl font-bold text-primary-foreground">
                                                {course.instructor_name
                                                    ?.split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-body font-bold text-card-foreground group-hover:text-primary transition-colors">
                                            {course.instructor_name}
                                        </h3>
                                        <p className="text-small text-muted-foreground mb-3">
                                            Course Instructor
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews */}
                            <div id="reviews" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600 fill-mode-both">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-h2 text-foreground">
                                        Student Reviews
                                    </h2>
                                    {(course.is_enrolled && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-button transition-all hover:bg-muted"
                                            onClick={() =>
                                                setShowReviewForm(!showReviewForm)
                                            }
                                        >
                                            {showReviewForm
                                                ? "Cancel"
                                                : isEditingReview
                                                  ? "Edit your Review"
                                                  : "Write a Review"}
                                        </Button>
                                    )) || (
                                        <span className="text-small text-muted-foreground font-medium">
                                            {course.review_count || 0} reviews
                                        </span>
                                    )}
                                </div>

                                {showReviewForm && (
                                    <div className="bg-card rounded-card card-shadow p-6 mb-8 border-2 border-primary/20 animate-in zoom-in-95 duration-300">
                                        <h3 className="text-body font-bold mb-4">
                                            {isEditingReview
                                                ? "Edit your review"
                                                : "What do you think of this course?"}
                                        </h3>
                                        <form
                                            onSubmit={handleReviewSubmit}
                                            className="space-y-4"
                                        >
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() =>
                                                            setUserReviewRating(s)
                                                        }
                                                        className="transition-transform hover:scale-125"
                                                    >
                                                        <Star
                                                            size={24}
                                                            className={
                                                                s <= userRating
                                                                    ? "fill-amber-400 text-amber-400"
                                                                    : "text-muted-foreground/30"
                                                            }
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                value={userComment}
                                                onChange={(e) =>
                                                    setUserComment(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Share your experience..."
                                                className="w-full p-4 text-small bg-muted/30 border border-border rounded-button outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] transition-all"
                                                required
                                            />
                                            <Button
                                                type="submit"
                                                className="gradient-primary border-0 rounded-button px-8 font-bold transition-all hover:scale-105 active:scale-95"
                                                disabled={reviewMutation.isPending}
                                            >
                                                {reviewMutation.isPending ? (
                                                    <Loader2 className="animate-spin mr-2" />
                                                ) : isEditingReview ? (
                                                    "Update Review"
                                                ) : (
                                                    "Submit Review"
                                                )}
                                            </Button>
                                        </form>
                                    </div>
                                )}

                                <div className="grid gap-4">
                                    {(reviews.length > 0 &&
                                        reviews.map((r, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-card rounded-card card-shadow p-6 transition-all hover:shadow-md hover:-translate-y-1 animate-in fade-in duration-500 fill-mode-both"
                                                style={{ animationDelay: `${idx * 100}ms` }}
                                            >
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shrink-0 text-primary-foreground font-bold border-2 border-white shadow-sm transition-transform hover:scale-110">
                                                        {r.first_name[0]}
                                                        {r.last_name[0]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-small font-bold text-foreground truncate">
                                                            {r.first_name} {r.last_name}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                                            {new Date(
                                                                r.reviewed_at,
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <RatingStars
                                                        rating={r.rating}
                                                        showValue={false}
                                                        size={12}
                                                    />
                                                </div>
                                                <p className="text-body text-muted-foreground leading-relaxed italic">
                                                    "{r.comment}"
                                                </p>
                                            </div>
                                        )) || (
                                            <div className="text-center py-12 bg-muted/20 rounded-card border-2 border-dashed border-border animate-in fade-in duration-700">
                                                <Star size={32} className="text-muted-foreground/30 mx-auto mb-3" />
                                                <p className="text-muted-foreground">No reviews yet for this course.</p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CourseDetails;
