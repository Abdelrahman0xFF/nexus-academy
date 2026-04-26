import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Star,
    Clock,
    BookOpen,
    Users,
    Globe,
    Award,
    PlayCircle,
    CheckCircle,
    ChevronDown,
    CreditCard,
    ShieldCheck,
    Lock,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";
import RatingStars from "@/components/RatingStars";
import { getMediaUrl } from "@/lib/utils";
import { api, ApiResponse } from "@/lib/api-client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "@/lib/courses-api";
import { enrollmentApi } from "@/lib/enrollment-api";
import { reviewApi, Review } from "@/lib/reviews-api";
import { useAuth } from "@/hooks/use-auth";

const CourseDetails = () => {
    const { id } = useParams();
    const courseId = Number(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [isEnrolling, setIsEnrolling] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userRating, setUserRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditingReview, setIsEditingReview] = useState(false);

    const { data: course, isLoading: isCourseLoading } = useQuery({
        queryKey: ["course", courseId],
        queryFn: () => coursesApi.getById(courseId),
        enabled: !!courseId,
    });

    const { data: content, isLoading: isContentLoading } = useQuery({
        queryKey: ["course-content", courseId],
        queryFn: () => coursesApi.getCourseContent(courseId),
        enabled: !!courseId,
    });

    const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
        queryKey: ["course-reviews", courseId],
        queryFn: () => reviewApi.getByCourse(courseId),
        enabled: !!courseId,
    });

    const { data: userReviewRes } = useQuery({
        queryKey: ["user-review", courseId],
        queryFn: () =>
            api.get<any, ApiResponse<Review>>(`/reviews/${courseId}/me`),
        enabled: !!user && !!courseId && !!course?.is_enrolled,
    });

    const userReview = userReviewRes?.data;

    useEffect(() => {
        if (userReview) {
            setUserRating(userReview.rating);
            setReviewComment(userReview.comment);
            setIsEditingReview(true);
        }
    }, [userReview]);

    const enrollMutation = useMutation({
        mutationFn: (paymentMethod: string) =>
            enrollmentApi.enroll(courseId, paymentMethod),
        onSuccess: () => {
            toast.success("Successfully enrolled in " + course?.title);
            queryClient.invalidateQueries({ queryKey: ["course", courseId] });
            queryClient.invalidateQueries({
                queryKey: ["course-content", courseId],
            });
            queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
            setIsDialogOpen(false);
            navigate(`/learn/${courseId}`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Enrollment failed");
        },
        onSettled: () => {
            setIsEnrolling(false);
        },
    });

    const reviewMutation = useMutation({
        mutationFn: (data: { rating: number; comment: string }) =>
            isEditingReview
                ? reviewApi.update(courseId, data)
                : reviewApi.create(courseId, data),
        onSuccess: () => {
            toast.success(
                isEditingReview
                    ? "Review updated successfully!"
                    : "Review submitted successfully!",
            );
            queryClient.invalidateQueries({
                queryKey: ["course-reviews", courseId],
            });
            queryClient.invalidateQueries({ queryKey: ["course", courseId] });
            queryClient.invalidateQueries({
                queryKey: ["user-review", courseId],
            });
            setReviewComment("");
            setShowReviewForm(false);
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || "Failed to submit review",
            );
        },
    });

    const handleEnroll = () => {
        if (!user) {
            toast.error("Please login to enroll in courses");
            navigate("/login");
            return;
        }
        setIsEnrolling(true);
        enrollMutation.mutate("card");
    };

    const handleSubmitReview = () => {
        if (!reviewComment.trim()) {
            toast.error("Please enter a comment");
            return;
        }
        reviewMutation.mutate({ rating: userRating, comment: reviewComment });
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    if (isCourseLoading || isContentLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </MainLayout>
        );
    }

    if (!course) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-20 text-center">
                    <h2 className="text-h2">Course not found</h2>
                    <Button
                        onClick={() => navigate("/courses")}
                        className="mt-4"
                    >
                        Back to Courses
                    </Button>
                </div>
            </MainLayout>
        );
    }

    const totalLessons =
        content?.sections.reduce((a, s) => a + s.lessons.length, 0) || 0;
    const courseImageUrl = getMediaUrl(course.thumbnail_url);

    return (
        <MainLayout>
            {/* Hero */}
            <section className="gradient-primary min-h-[calc(100vh-64px)] flex justify-center items-center">
                <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 h-full">
                    <div className="grid lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 text-primary-foreground">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-foreground/20">
                                    {course.category_name}
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-foreground/20">
                                    {course.level}
                                </span>
                            </div>
                            <h1 className="text-h1 lg:text-4xl text-primary-foreground mb-4">
                                {course.title}
                            </h1>
                            <p className="text-body text-primary-foreground/80 mb-6 max-w-2xl">
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
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
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
                                    <div className="text-small font-medium text-primary-foreground">
                                        {course.instructor_name}
                                    </div>
                                    <div className="text-xs text-primary-foreground/60">
                                        Instructor
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-6 mt-6 text-small text-primary-foreground/70">
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />{" "}
                                    {formatDuration(course.duration)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <BookOpen size={14} /> {totalLessons}{" "}
                                    lessons
                                </span>
                                <span className="flex items-center gap-1">
                                    <Award size={14} /> Certificate
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-8 py-10">
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* What you'll learn */}
                        <div className="bg-card rounded-card card-shadow p-6">
                            <h2 className="text-h3 text-card-foreground mb-4">
                                Course Description
                            </h2>
                            <p className="text-small text-muted-foreground whitespace-pre-wrap">
                                {course.description}
                            </p>
                        </div>

                        {/* Curriculum */}
                        <div>
                            <h2 className="text-h3 text-foreground mb-4">
                                Course Curriculum
                            </h2>
                            <p className="text-small text-muted-foreground mb-6">
                                {content?.sections.length || 0} sections •{" "}
                                {totalLessons} lessons •{" "}
                                {formatDuration(course.duration)} total
                            </p>
                            <Accordion
                                type="multiple"
                                defaultValue={["section-1"]}
                                className="space-y-3"
                            >
                                {content?.sections.map((section, i) => (
                                    <AccordionItem
                                        key={section.section_order}
                                        value={`section-${section.section_order}`}
                                        className="bg-card rounded-card card-shadow overflow-hidden border-0"
                                    >
                                        <AccordionTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors hover:no-underline [&>svg]:hidden">
                                            <div className="flex items-center gap-3">
                                                <BookOpen
                                                    size={18}
                                                    className="text-primary"
                                                />
                                                <span className="font-medium text-card-foreground text-small">
                                                    {section.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-muted-foreground">
                                                    {section.lessons.length}{" "}
                                                    lessons
                                                </span>
                                                <ChevronDown
                                                    size={16}
                                                    className="shrink-0 transition-transform duration-200"
                                                />
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-0 border-t border-border">
                                            {section.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.lesson_order}
                                                    className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {lesson.is_completed ? (
                                                            <CheckCircle
                                                                size={16}
                                                                className="text-secondary"
                                                            />
                                                        ) : (
                                                            <PlayCircle
                                                                size={16}
                                                                className="text-muted-foreground"
                                                            />
                                                        )}
                                                        <span
                                                            className={`text-small ${lesson.is_completed ? "text-muted-foreground" : "text-card-foreground"}`}
                                                        >
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDuration(
                                                            lesson.duration,
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>

                        {/* Instructor */}
                        <div className="bg-card rounded-card card-shadow p-6">
                            <h2 className="text-h3 text-card-foreground mb-4">
                                Your Instructor
                            </h2>
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shrink-0 overflow-hidden">
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
                                <div>
                                    <h3 className="text-body font-semibold text-card-foreground">
                                        {course.instructor_name}
                                    </h3>
                                    <p className="text-small text-muted-foreground mb-3">
                                        Course Instructor
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div id="reviews">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-h3 text-foreground">
                                    Student Reviews
                                </h2>
                                {(course.is_enrolled && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-button"
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
                                    <span className="text-small text-muted-foreground">
                                        {course.review_count || 0} reviews
                                    </span>
                                )}
                            </div>

                            {showReviewForm && (
                                <div className="bg-card rounded-card card-shadow p-6 mb-8 border border-primary/20 animate-in fade-in slide-in-from-top-4">
                                    <h3 className="text-body font-bold mb-4">
                                        {isEditingReview
                                            ? "Edit your review"
                                            : "Share your experience"}
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground block mb-2">
                                                Rating
                                            </label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() =>
                                                            setUserRating(star)
                                                        }
                                                        className="focus:outline-none"
                                                    >
                                                        <Star
                                                            size={24}
                                                            className={`${star <= userRating ? "text-amber-400 fill-amber-400" : "text-muted border-muted"} transition-colors`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground block mb-2">
                                                Your Review
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={reviewComment}
                                                onChange={(e) =>
                                                    setReviewComment(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="What did you like or dislike about this course?"
                                                className="w-full px-4 py-3 text-small border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-muted/30 resize-none"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleSubmitReview}
                                            disabled={reviewMutation.isPending}
                                            className="gradient-primary border-0 text-primary-foreground font-bold rounded-button"
                                        >
                                            {reviewMutation.isPending
                                                ? "Submitting..."
                                                : isEditingReview
                                                  ? "Update Review"
                                                  : "Submit Review"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {Array.isArray(reviews) &&
                                    reviews.map((review, i) => (
                                        <div
                                            key={i}
                                            className="bg-card rounded-card card-shadow p-5"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                        {review.avatar_url ? (
                                                            <img
                                                                src={getMediaUrl(
                                                                    review.avatar_url,
                                                                )}
                                                                alt={`${review.first_name} ${review.last_name}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-bold text-muted-foreground">
                                                                {
                                                                    review
                                                                        .first_name[0]
                                                                }
                                                                {
                                                                    review
                                                                        .last_name[0]
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-small font-medium text-card-foreground">
                                                        {review.first_name}{" "}
                                                        {review.last_name}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        review.reviewed_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <RatingStars
                                                rating={review.rating}
                                                size={14}
                                                showValue={false}
                                            />
                                            <p className="text-small text-muted-foreground mt-2">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))}
                                {reviews.length === 0 && (
                                    <p className="text-center py-10 text-muted-foreground text-small">
                                        No reviews yet. Be the first to review
                                        this course!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sticky Purchase Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-card rounded-card elevated-shadow p-6 space-y-5">
                            <div className="aspect-video rounded-lg bg-muted overflow-hidden flex items-center justify-center relative">
                                {courseImageUrl ? (
                                    <img
                                        src={courseImageUrl}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 gradient-primary opacity-80 flex items-center justify-center">
                                        <PlayCircle
                                            size={56}
                                            className="text-primary-foreground/90"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-baseline gap-3">
                                {course.price === 0 ? (
                                    <span className="text-3xl font-bold text-emerald-600">
                                        Free
                                    </span>
                                ) : (
                                    <span className="text-3xl font-bold text-primary">
                                        ${course.price ?? course.original_price}
                                    </span>
                                )}

                                {course.price !== null &&
                                    course.price !== undefined &&
                                    course.price > 0 &&
                                    course.price < course.original_price && (
                                        <>
                                            <span className="text-body text-muted-foreground line-through">
                                                ${course.original_price}
                                            </span>
                                            <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                                                {Math.round(
                                                    (1 -
                                                        course.price /
                                                            course.original_price) *
                                                        100,
                                                )}
                                                % OFF
                                            </span>
                                        </>
                                    )}
                            </div>

                            {course.is_enrolled ? (
                                <Button
                                    onClick={() =>
                                        navigate(`/learn/${courseId}`)
                                    }
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-button py-3 font-semibold transition-colors"
                                >
                                    Go to Course
                                </Button>
                            ) : (
                                <Dialog
                                    open={isDialogOpen}
                                    onOpenChange={setIsDialogOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button className="w-full gradient-primary border-0 text-primary-foreground rounded-button py-3 font-semibold hover:opacity-90 transition-opacity">
                                            Enroll Now
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Complete Enrollment
                                            </DialogTitle>
                                            <DialogDescription>
                                                You are about to enroll in{" "}
                                                <strong>{course.title}</strong>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                                <div className="flex justify-between text-small">
                                                    <span>Course Price</span>
                                                    <span className="font-bold">
                                                        ${course.price}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-small text-muted-foreground">
                                                    <span>Tax</span>
                                                    <span>$0.00</span>
                                                </div>
                                                <div className="border-t border-border pt-2 flex justify-between font-bold">
                                                    <span>Total</span>
                                                    <span className="text-primary">
                                                        ${course.price}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="relative">
                                                    <CreditCard
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                        size={16}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Card Number"
                                                        className="w-full pl-10 pr-4 py-2 text-small border border-border rounded-md outline-none focus:ring-2 focus:ring-primary/20"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="w-full px-4 py-2 text-small border border-border rounded-md outline-none focus:ring-2 focus:ring-primary/20"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="CVC"
                                                        className="w-full px-4 py-2 text-small border border-border rounded-md outline-none focus:ring-2 focus:ring-primary/20"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground justify-center">
                                                <Lock size={10} /> Secure SSL
                                                Encrypted Payment
                                                <ShieldCheck size={10} /> 30-Day
                                                Money Back Guarantee
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                className="w-full gradient-primary border-0 text-primary-foreground font-bold"
                                                onClick={handleEnroll}
                                                disabled={isEnrolling}
                                            >
                                                {isEnrolling
                                                    ? "Processing..."
                                                    : `Pay $${course.price} & Enroll`}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                            <div className="space-y-3 pt-2">
                                {[
                                    {
                                        label: "Duration",
                                        value: formatDuration(course.duration),
                                    },
                                    {
                                        label: "Lessons",
                                        value: `${totalLessons} lessons`,
                                    },
                                    { label: "Level", value: course.level },
                                    { label: "Certificate", value: "Yes" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex justify-between text-small"
                                    >
                                        <span className="text-muted-foreground">
                                            {item.label}
                                        </span>
                                        <span className="font-medium text-card-foreground">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CourseDetails;
