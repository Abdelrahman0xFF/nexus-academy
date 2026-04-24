import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Search,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";
import CourseCard from "@/components/CourseCard";
import { coursesApi, Course } from "@/lib/courses-api";
import { categoryApi } from "@/lib/categories-api";
import { Category } from "@/lib/data";
import { AppSelect } from "@/components/ui/app-select";

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const Courses = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | "All">(
        () => {
            const catId = searchParams.get("category_id");
            return catId ? parseInt(catId) : "All";
        }
    );
    const [selectedLevel, setSelectedLevel] = useState(searchParams.get("level") ?? "All Levels");
    const [page, setPage] = useState(() => {
        const p = searchParams.get("page");
        return p ? parseInt(p) : 1;
    });
    const [totalCourses, setTotalCourses] = useState(0);
    const perPage = 8;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryApi.getAll();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const params: any = {
                    page,
                    limit: perPage,
                };
                if (search) params.search = search;
                if (selectedCategoryId !== "All") params.category_id = selectedCategoryId;
                if (selectedLevel !== "All Levels") params.level = selectedLevel;

                const data = await coursesApi.getAll(params);
                setCourses(data);
                // Since the API doesn't return total count in the same request (based on models), 
                // we might need another way or just estimate. 
                // For now, let's assume if we got full limit, there might be more.
                // Alternatively, we could update the backend to return total count.
                // Assuming the backend model returns an array, let's just use its length for now 
                // or assume a large number if we want to show pagination.
                // Better yet, let's just show next/prev based on length.
                setTotalCourses(data.length === perPage ? page * perPage + 1 : (page - 1) * perPage + data.length);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();

        // Update search params
        const newParams: any = {};
        if (page > 1) newParams.page = page.toString();
        if (search) newParams.search = search;
        if (selectedCategoryId !== "All") newParams.category_id = selectedCategoryId.toString();
        if (selectedLevel !== "All Levels") newParams.level = selectedLevel;
        setSearchParams(newParams);

    }, [page, search, selectedCategoryId, selectedLevel, setSearchParams]);

    const handleSearchChange = (val: string) => {
        setSearch(val);
        setPage(1);
    };

    const handleCategoryChange = (val: string | number) => {
        setSelectedCategoryId(val === "All" ? "All" : Number(val));
        setPage(1);
    };

    const handleLevelChange = (val: string) => {
        setSelectedLevel(val);
        setPage(1);
    };

    const totalPages = Math.ceil(totalCourses / perPage);

    return (
        <MainLayout>
            <div className="container mx-auto px-4 lg:px-8 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-h1 text-foreground mb-2">
                        Explore Courses
                    </h1>
                    <p className="text-body text-muted-foreground">
                        Discover world-class courses from top instructors
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
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Search courses or instructors..."
                                className="w-full pl-10 pr-4 py-2.5 text-small bg-muted rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            <AppSelect
                                value={selectedCategoryId.toString()}
                                onValueChange={handleCategoryChange}
                                options={[
                                    { label: "All Categories", value: "All" },
                                    ...categories.map(c => ({ label: c.name, value: c.category_id.toString() }))
                                ]}
                                triggerClassName="w-full min-w-[160px]"
                            />

                            <AppSelect
                                value={selectedLevel}
                                onValueChange={handleLevelChange}
                                options={levels}
                                triggerClassName="w-full min-w-[140px]"
                            />
                        </div>
                    </div>

                    {/* Category pills */}
                    <div className="flex gap-2 mt-4 flex-wrap">
                        <button
                            onClick={() => handleCategoryChange("All")}
                            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
                                selectedCategoryId === "All"
                                    ? "gradient-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            All
                        </button>
                        {categories.map((c) => (
                            <button
                                key={c.category_id}
                                onClick={() => handleCategoryChange(c.category_id)}
                                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
                                    selectedCategoryId === c.category_id
                                        ? "gradient-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-small text-muted-foreground">
                        {loading ? "Searching..." : `Showing ${courses.length} courses`}
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((c) => (
                            <CourseCard key={c.course_id} course={c} />
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
                {!loading && (courses.length === perPage || page > 1) && (
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
                        <span className="text-small font-medium mx-2">
                            Page {page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-button"
                            onClick={() => setPage(page + 1)}
                            disabled={courses.length < perPage}
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
