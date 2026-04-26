import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Search,
    SlidersHorizontal,
    Loader2,
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import CourseCard from "@/components/CourseCard";
import { coursesApi } from "@/lib/courses-api";
import { categoryApi } from "@/lib/categories-api";
import { AppSelect } from "@/components/ui/app-select";
import { useQuery } from "@tanstack/react-query";

import { AppPagination } from "@/components/ui/app-pagination";

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const Courses = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
    
    const page = parseInt(searchParams.get("page") ?? "1");
    const selectedCategoryId = searchParams.get("category_id") ?? "All";
    const selectedLevel = searchParams.get("level") ?? "All Levels";
    const search = searchParams.get("search") ?? "";
    const sortBy = searchParams.get("sortBy") ?? "Time";
    const order = searchParams.get("order") ?? "DESC";
    
    const perPage = 8;

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryApi.getAll(),
    });

    const { data, status, isFetching, isPlaceholderData } = useQuery({
        queryKey: ["courses-explore", page, search, selectedCategoryId, selectedLevel, sortBy, order],
        queryFn: () => {
            const params: any = {
                page,
                limit: perPage,
                sortBy,
                order
            };
            if (search) params.search = search;
            if (selectedCategoryId !== "All") params.category_id = parseInt(selectedCategoryId);
            if (selectedLevel !== "All Levels") params.level = selectedLevel;
            return coursesApi.getAll(params);
        },
        placeholderData: (previousData) => previousData,
    });

    const courses = data?.courses ?? [];
    const totalCourses = data?.total ?? 0;

    const totalPages = Math.ceil(totalCourses / perPage);
    const showInitialLoading = status === "pending" && !isPlaceholderData;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== search) {
                updateParams({ search: searchInput, page: "1" });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput, search]);

    const updateParams = (updates: Record<string, string | null>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "All" || value === "All Levels") {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });
        setSearchParams(newParams);
    };

    const handleCategoryChange = (val: string | number) => {
        updateParams({ category_id: val.toString(), page: "1" });
    };

    const handleLevelChange = (val: string) => {
        updateParams({ level: val, page: "1" });
    };

    const handleSortChange = (val: string) => {
        const [newSortBy, newOrder] = val.split("-");
        updateParams({ sortBy: newSortBy, order: newOrder, page: "1" });
    };

    const handlePageChange = (p: number) => {
        updateParams({ page: p.toString() });
    };

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
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search courses or instructors..."
                                className="w-full pl-10 pr-4 py-2.5 text-small bg-muted rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            <AppSelect
                                value={`${sortBy}-${order}`}
                                onValueChange={handleSortChange}
                                options={[
                                    { label: "Newest", value: "Time-DESC" },
                                    { label: "Oldest", value: "Time-ASC" },
                                    { label: "Price: Low to High", value: "Price-ASC" },
                                    { label: "Price: High to Low", value: "Price-DESC" },
                                    { label: "Highest Rated", value: "Rating-DESC" },
                                ]}
                                triggerClassName="w-full min-w-[160px]"
                            />

                            <AppSelect
                                value={selectedCategoryId}
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
                                    selectedCategoryId === c.category_id.toString()
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
                        {isFetching ? "Syncing..." : `Showing ${courses.length} of ${totalCourses} courses`}
                    </p>
                </div>

                {showInitialLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : courses.length > 0 ? (
                    <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
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
                {!showInitialLoading && totalPages > 1 && (
                    <AppPagination 
                        currentPage={page} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange} 
                    />
                )}
            </div>
        </MainLayout>
    );
};

export default Courses;
