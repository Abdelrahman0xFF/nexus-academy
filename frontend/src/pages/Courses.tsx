import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Search,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/lib/data";
import { AppSelect } from "@/components/ui/app-select";

const allCategories = [
    "All",
    "Web Development",
    "Data Science",
    "Design",
    "Mobile Development",
    "Marketing",
    "Cloud Computing",
];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const Courses = () => {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(
        () => searchParams.get("category") ?? "All",
    );
    const [selectedLevel, setSelectedLevel] = useState("All Levels");
    const [page, setPage] = useState(1);
    const perPage = 8;

    useEffect(() => {
        const categoryFromQuery = searchParams.get("category") ?? "All";
        setSelectedCategory(categoryFromQuery);
        setPage(1);
    }, [searchParams]);

    const filtered = courses.filter((c) => {
        const matchSearch =
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.instructor.toLowerCase().includes(search.toLowerCase());
        const matchCat =
            selectedCategory === "All" || c.category === selectedCategory;
        const matchLevel =
            selectedLevel === "All Levels" || c.level === selectedLevel;
        return matchSearch && matchCat && matchLevel;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <MainLayout>
            <div className="container mx-auto px-4 lg:px-8 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-h1 text-foreground mb-2">
                        Explore Courses
                    </h1>
                    <p className="text-body text-muted-foreground">
                        Discover {courses.length}+ courses from top instructors
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-card rounded-card card-shadow p-4 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search courses or instructors..."
                                className="w-full pl-10 pr-4 py-2.5 text-small bg-muted rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            <AppSelect
                                value={selectedCategory}
                                onValueChange={(val) => {
                                    setSelectedCategory(val);
                                    setPage(1);
                                }}
                                options={allCategories}
                                triggerClassName="w-full min-w-[140px]"
                            />

                            <AppSelect
                                value={selectedLevel}
                                onValueChange={(val) => {
                                    setSelectedLevel(val);
                                    setPage(1);
                                }}
                                options={levels}
                                triggerClassName="w-full min-w-[140px]"
                            />
                        </div>
                    </div>

                    {/* Category pills */}
                    <div className="flex gap-2 mt-4 flex-wrap">
                        {allCategories.map((c) => (
                            <button
                                key={c}
                                onClick={() => {
                                    setSelectedCategory(c);
                                    setPage(1);
                                }}
                                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
                                    selectedCategory === c
                                        ? "gradient-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-small text-muted-foreground">
                        Showing {paginated.length} of {filtered.length} courses
                    </p>
                </div>

                {paginated.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {paginated.map((c) => (
                            <CourseCard key={c.id} course={c} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <SlidersHorizontal
                            size={48}
                            className="mx-auto text-muted-foreground/30 mb-4"
                        />
                        <h3 className="text-h3 text-foreground mb-2">
                            No courses found
                        </h3>
                        <p className="text-body text-muted-foreground">
                            Try adjusting your filters
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-button"
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((p) => (
                            <Button
                                key={p}
                                variant={p === page ? "default" : "outline"}
                                size="sm"
                                className={`rounded-button w-9 ${p === page ? "gradient-primary border-0 text-primary-foreground" : ""}`}
                                onClick={() => setPage(p)}
                            >
                                {p}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-button"
                            onClick={() =>
                                setPage(Math.min(totalPages, page + 1))
                            }
                            disabled={page === totalPages}
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default Courses;
