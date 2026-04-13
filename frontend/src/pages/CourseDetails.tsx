import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";
import RatingStars from "@/components/RatingStars";
import { courses, curriculum, initialReviews, Review } from "@/lib/data";
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

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userRating, setUserRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [reviews, setReviews] = useState<Review[]>(
        initialReviews.filter(r => r.courseId === id || (id === undefined && r.courseId === "1"))
    );
    
    const course = courses.find((c) => c.id === id) || courses[0];

    const handleEnroll = () => {
        setIsEnrolling(true);
        // Simulate payment process
        setTimeout(() => {
            setIsEnrolling(false);
            toast.success("Successfully enrolled in " + course.title);
            navigate(`/learn/${course.id}`);
        }, 2000);
    };

    const handleSubmitReview = () => {
        if (!reviewComment.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        const newReview: Review = {
            id: `r${Date.now()}`,
            courseId: course.id,
            userName: "Current User", // Mock user
            rating: userRating,
            comment: reviewComment,
            date: "Just now",
        };

        setReviews([newReview, ...reviews]);
        setReviewComment("");
        setShowReviewForm(false);
        toast.success("Review submitted successfully!");
    };
    const totalLessons = curriculum.reduce((a, s) => a + s.lessons.length, 0);
    const completedLessons = curriculum.reduce(
        (a, s) => a + s.lessons.filter((l) => l.completed).length,
        0,
    );

    return (
        <MainLayout>
            {/* Hero */}
            <section className="gradient-primary min-h-[calc(100vh-65px)] flex justify-center items-center">
                <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 h-full">
                    <div className="grid lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 text-primary-foreground">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-foreground/20">
                                    {course.category}
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-foreground/20">
                                    {course.level}
                                </span>
                            </div>
                            <h1 className="text-h1 lg:text-4xl text-primary-foreground mb-4">
                                {course.title}
                            </h1>
                            <p className="text-body text-primary-foreground/80 mb-6 max-w-2xl">
                                Master the complete toolkit to become a
                                professional developer. This comprehensive
                                course covers everything from basics to advanced
                                concepts with hands-on projects.
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <RatingStars
                                    rating={course.rating}
                                    reviewCount={course.reviewCount}
                                    size={16}
                                />
                                <span className="flex items-center gap-1 text-small text-primary-foreground/70">
                                    <Users size={14} />{" "}
                                    {course.students.toLocaleString()} students
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                    <span className="text-small font-bold">
                                        {course.instructor
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-small font-medium text-primary-foreground">
                                        {course.instructor}
                                    </div>
                                    <div className="text-xs text-primary-foreground/60">
                                        Senior Instructor
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-6 mt-6 text-small text-primary-foreground/70">
                                <span className="flex items-center gap-1">
                                    <Clock size={14} /> {course.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                    <BookOpen size={14} /> {course.lessons}{" "}
                                    lessons
                                </span>
                                <span className="flex items-center gap-1">
                                    <Globe size={14} /> English
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
                                What You'll Learn
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {[
                                    "Build real-world applications from scratch",
                                    "Master modern frameworks and tools",
                                    "Deploy and scale applications",
                                    "Write clean, maintainable code",
                                    "Implement authentication and security",
                                    "Work with databases and APIs",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-start gap-2"
                                    >
                                        <CheckCircle
                                            size={18}
                                            className="text-secondary shrink-0 mt-0.5"
                                        />
                                        <span className="text-small text-muted-foreground">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Curriculum */}
                        <div>
                            <h2 className="text-h3 text-foreground mb-4">
                                Course Curriculum
                            </h2>
                            <p className="text-small text-muted-foreground mb-6">
                                {curriculum.length} sections • {totalLessons}{" "}
                                lessons • {course.duration} total
                            </p>
                            <Accordion type="multiple" defaultValue={["item-0"]} className="space-y-3">
                                {curriculum.map((section, i) => (
                                    <AccordionItem
                                        key={i}
                                        value={`item-${i}`}
                                        className="bg-card rounded-card card-shadow overflow-hidden border-0"
                                    >
                                        <AccordionTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors hover:no-underline [&>svg]:hidden">
                                            <div className="flex items-center gap-3">
                                                <BookOpen
                                                    size={18}
                                                    className="text-primary"
                                                />
                                                <span className="font-medium text-card-foreground text-small">
                                                    {section.section}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-muted-foreground">
                                                    {section.lessons.length}{" "}
                                                    lessons
                                                </span>
                                                <ChevronDown size={16} className="shrink-0 transition-transform duration-200" />
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-0 border-t border-border">
                                            {section.lessons.map(
                                                (lesson, j) => (
                                                    <div
                                                        key={j}
                                                        className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {lesson.completed ? (
                                                                <CheckCircle
                                                                    size={
                                                                        16
                                                                    }
                                                                    className="text-secondary"
                                                                />
                                                            ) : (
                                                                <PlayCircle
                                                                    size={
                                                                        16
                                                                    }
                                                                    className="text-muted-foreground"
                                                                />
                                                            )}
                                                            <span
                                                                className={`text-small ${lesson.completed ? "text-muted-foreground" : "text-card-foreground"}`}
                                                            >
                                                                {
                                                                    lesson.title
                                                                }
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                lesson.duration
                                                            }
                                                        </span>
                                                    </div>
                                                ),
                                            )}
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
                                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shrink-0">
                                    <span className="text-xl font-bold text-primary-foreground">
                                        {course.instructor
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-body font-semibold text-card-foreground">
                                        {course.instructor}
                                    </h3>
                                    <p className="text-small text-muted-foreground mb-3">
                                        Senior Full-Stack Developer with 10+
                                        years of experience
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Star
                                                size={12}
                                                className="text-amber-400 fill-amber-400"
                                            />{" "}
                                            {course.rating} rating
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users size={12} />{" "}
                                            {course.students.toLocaleString()}{" "}
                                            students
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <BookOpen size={12} /> 12 courses
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div id="reviews">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-h3 text-foreground">
                                    Student Reviews
                                </h2>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-button"
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                >
                                    {showReviewForm ? "Cancel" : "Write a Review"}
                                </Button>
                            </div>

                            {showReviewForm && (
                                <div className="bg-card rounded-card card-shadow p-6 mb-8 border border-primary/20 animate-in fade-in slide-in-from-top-4">
                                    <h3 className="text-body font-bold mb-4">Share your experience</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground block mb-2">Rating</label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button 
                                                        key={star} 
                                                        onClick={() => setUserRating(star)}
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
                                            <label className="text-xs font-medium text-muted-foreground block mb-2">Your Review</label>
                                            <textarea 
                                                rows={4}
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                placeholder="What did you like or dislike about this course?"
                                                className="w-full px-4 py-3 text-small border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-muted/30 resize-none"
                                            />
                                        </div>
                                        <Button 
                                            onClick={handleSubmitReview}
                                            className="gradient-primary border-0 text-primary-foreground font-bold rounded-button"
                                        >
                                            Submit Review
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="bg-card rounded-card card-shadow p-5"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                    <span className="text-xs font-bold text-muted-foreground">
                                                        {review.userName[0]}
                                                    </span>
                                                </div>
                                                <span className="text-small font-medium text-card-foreground">
                                                    {review.userName}
                                                </span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {review.date}
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
                                    <p className="text-center py-10 text-muted-foreground text-small">No reviews yet. Be the first to review this course!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sticky Purchase Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-card rounded-card elevated-shadow p-6 space-y-5">
                            <div className="aspect-video rounded-lg bg-muted gradient-primary opacity-80 flex items-center justify-center">
                                <PlayCircle
                                    size={56}
                                    className="text-primary-foreground/90"
                                />
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-primary">
                                    ${course.price}
                                </span>
                                {course.originalPrice && (
                                    <>
                                        <span className="text-body text-muted-foreground line-through">
                                            ${course.originalPrice}
                                        </span>
                                        <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                                            {Math.round(
                                                (1 -
                                                    course.price /
                                                        course.originalPrice) *
                                                    100,
                                            )}
                                            % OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full gradient-primary border-0 text-primary-foreground rounded-button py-3 font-semibold hover:opacity-90 transition-opacity">
                                        Enroll Now
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Complete Enrollment</DialogTitle>
                                        <DialogDescription>
                                            You are about to enroll in <strong>{course.title}</strong>
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between text-small">
                                                <span>Course Price</span>
                                                <span className="font-bold">${course.price}</span>
                                            </div>
                                            <div className="flex justify-between text-small text-muted-foreground">
                                                <span>Tax</span>
                                                <span>$0.00</span>
                                            </div>
                                            <div className="border-t border-border pt-2 flex justify-between font-bold">
                                                <span>Total</span>
                                                <span className="text-primary">${course.price}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
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
                                            <Lock size={10} /> Secure SSL Encrypted Payment
                                            <ShieldCheck size={10} /> 30-Day Money Back Guarantee
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button 
                                            className="w-full gradient-primary border-0 text-primary-foreground font-bold" 
                                            onClick={handleEnroll}
                                            disabled={isEnrolling}
                                        >
                                            {isEnrolling ? "Processing..." : `Pay $${course.price} & Enroll`}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="outline"
                                className="w-full rounded-button py-3"
                            >
                                Add to Wishlist
                            </Button>
                            <div className="space-y-3 pt-2">
                                {[
                                    {
                                        label: "Duration",
                                        value: course.duration,
                                    },
                                    {
                                        label: "Lessons",
                                        value: `${course.lessons} lessons`,
                                    },
                                    { label: "Level", value: course.level },
                                    { label: "Language", value: "English" },
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
