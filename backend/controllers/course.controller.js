import Course from "../models/course.model.js";
import Category from "../models/category.model.js";
import Section from "../models/section.model.js";
import Lesson from "../models/lesson.model.js";
import { uploadToDrive, deleteFromDrive } from "../services/drive.service.js";
import {
    courseSchema,
    updateCourseSchema,
} from "../validators/course.validator.js";
import { successResponse, errorResponse } from "../utils/response.js";
import fs from "fs";

const createCourse = async (req, res, next) => {
    let courseThumbnailUrl = null;
    try {
        const { error } = courseSchema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const { category_id } = req.body;

        const category = await Category.findById(category_id);
        if (!category) {
            return errorResponse(res, "Category not found", 404);
        }

        if (req.file) {
            const uploadResult = await uploadToDrive(req.file);
            courseThumbnailUrl = uploadResult.fileId;
        }

        const newCourse = await Course.create({
            ...req.body,
            instructor_id: req.user.user_id,
            thumbnail_url: courseThumbnailUrl,
        });

        return successResponse(
            res,
            newCourse,
            "Course created successfully",
            201,
        );
    } catch (err) {
        if (courseThumbnailUrl) {
            try {
                await deleteFromDrive(courseThumbnailUrl);
            } catch (cleanupErr) {
                console.error(
                    "Failed to cleanup uploaded thumbnail after error:",
                    cleanupErr,
                );
            }
        }
        next(err);
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const getCourseById = async (req, res, next) => {
    try {
        const { course_id } = req.params;
        const userId = req.user?.user_id || null;
        const isAdmin = req.user?.role === "admin";

        const course = await Course.findById(course_id, userId, isAdmin);
        if (course) {
            return successResponse(res, course);
        } else {
            return errorResponse(res, "Course not found", 404);
        }
    } catch (err) {
        next(err);
    }
};

const getAllCourses = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user?.user_id || null;
        const isAdmin = req.user?.role === "admin";

        const courses = await Course.find(
            Number(page),
            Number(limit),
            userId,
            isAdmin,
        );
        return successResponse(res, courses);
    } catch (err) {
        next(err);
    }
};

const updateCourse = async (req, res, next) => {
    let newThumbnailUrl = null;
    try {
        const { course_id } = req.params;
        const { error } = updateCourseSchema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const userId = req.user.user_id;
        const isAdmin = req.user.role === "admin";

        const existingCourse = await Course.findById(
            course_id,
            userId,
            isAdmin,
        );
        if (!existingCourse) {
            return errorResponse(res, "Course not found", 404);
        }

        if (
            req.user.role !== "admin" &&
            existingCourse.instructor_id !== req.user.user_id
        ) {
            return errorResponse(
                res,
                "Forbidden: You are not authorized to update this course",
                403,
            );
        }

        const { category_id } = req.body;
        if (category_id) {
            const category = await Category.findById(category_id);
            if (!category) {
                return errorResponse(res, "Category not found", 404);
            }
        }

        const updateData = { ...req.body };
        delete updateData.instructor_id;

        if (req.file) {
            const uploadResult = await uploadToDrive(req.file);
            newThumbnailUrl = uploadResult.fileId;
            updateData.thumbnail_url = newThumbnailUrl;
        }

        const result = await Course.update(course_id, updateData);
        if (result) {
            if (newThumbnailUrl && existingCourse.thumbnail_url) {
                try {
                    await deleteFromDrive(existingCourse.thumbnail_url);
                } catch (err) {
                    console.error(
                        "Failed to delete old thumbnail from drive:",
                        err,
                    );
                }
            }
            return successResponse(
                res,
                {
                    ...result,
                    thumbnail_url:
                        updateData.thumbnail_url ||
                        existingCourse.thumbnail_url,
                },
                "Course updated successfully",
            );
        } else {
            if (newThumbnailUrl) {
                await deleteFromDrive(newThumbnailUrl);
            }
            return errorResponse(res, "Course not found", 404);
        }
    } catch (err) {
        if (newThumbnailUrl) {
            try {
                await deleteFromDrive(newThumbnailUrl);
            } catch (cleanupErr) {
                console.error(
                    "Failed to cleanup uploaded thumbnail after error:",
                    cleanupErr,
                );
            }
        }
        next(err);
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        const { course_id } = req.params;
        const userId = req.user.user_id;
        const isAdmin = req.user.role === "admin";

        const course = await Course.findById(course_id, userId, isAdmin);
        if (!course) {
            return errorResponse(res, "Course not found", 404);
        }

        if (
            req.user.role !== "admin" &&
            course.instructor_id !== req.user.user_id
        ) {
            return errorResponse(
                res,
                "Forbidden: You are not authorized to delete this course",
                403,
            );
        }

        const lessons = await Lesson.findByCourseId(course_id);

        const result = await Course.delete(course_id);
        if (result) {
            if (course.thumbnail_url) {
                try {
                    await deleteFromDrive(course.thumbnail_url);
                } catch (err) {
                    console.error(
                        "Failed to delete course thumbnail from drive:",
                        err,
                    );
                }
            }

            for (const lesson of lessons) {
                if (lesson.video_url) {
                    try {
                        await deleteFromDrive(lesson.video_url);
                    } catch (err) {
                        console.error(
                            `Failed to delete video for lesson ${lesson.lesson_order} of course ${course_id} from drive:`,
                            err,
                        );
                    }
                }
            }

            return successResponse(res, null, "Course deleted successfully");
        } else {
            return errorResponse(res, "Course not found", 404);
        }
    } catch (err) {
        next(err);
    }
};

const getCourseContent = async (req, res, next) => {
    try {
        const { course_id } = req.params;
        const userId = req.user?.user_id || null;

        const course = await Course.findById(
            course_id,
            userId,
            req.user?.role === "admin",
        );
        if (!course) {
            return errorResponse(res, "Course not found", 404);
        }

        const sections = await Section.findByCourseId(course_id);
        const lessons = await Lesson.findByCourseId(course_id);

        let completedLessonIds = new Set();
        if (userId) {
            const completed = await Lesson.getCompletedLessons(
                userId,
                course_id,
            );
            completed.forEach((l) => {
                completedLessonIds.add(`${l.section_order}-${l.lesson_order}`);
            });
        }

        const structuredContent = sections.map((section) => {
            const { course_id: _, ...sectionData } = section;

            return {
                ...sectionData,
                lessons: lessons
                    .filter(
                        (lesson) =>
                            lesson.section_order === section.section_order,
                    )
                    .map((lesson) => {
                        const {
                            course_id: _,
                            section_order: __,
                            ...lessonData
                        } = lesson;

                        return {
                            ...lessonData,
                            is_completed: completedLessonIds.has(
                                `${lesson.section_order}-${lesson.lesson_order}`,
                            ),
                        };
                    }),
            };
        });

        return successResponse(res, {
            course_id: course.course_id,
            title: course.title,
            sections: structuredContent,
        });
    } catch (err) {
        next(err);
    }
};

export {
    createCourse,
    getCourseById,
    getAllCourses,
    updateCourse,
    deleteCourse,
    getCourseContent,
};
