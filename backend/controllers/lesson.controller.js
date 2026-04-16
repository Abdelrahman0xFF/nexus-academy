import Lesson from "../models/lesson.model.js";
import Section from "../models/section.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import { uploadToDrive, deleteFromDrive } from "../services/drive.service.js";
import { getVideoDuration } from "../utils/video.js";
import { successResponse, errorResponse } from "../utils/response.js";
import fs from "fs";
import asyncHandler from "../utils/asyncHandler.js";

const createLesson = asyncHandler(async (req, res, next) => {
    const { course_id, section_order, lesson_order } = req.body;

    const section = await Section.findOne(course_id, section_order);
    if (!section) return errorResponse(res, "Section not found", 404);

    const course = await Course.findById(course_id);
    if (
        req.user.role !== "admin" &&
        course.instructor_id !== req.user.user_id
    ) {
        return errorResponse(
            res,
            "Forbidden: You are not authorized to add lessons to this section",
            403,
        );
    }

    const existingLesson = await Lesson.findOne(
        course_id,
        section_order,
        lesson_order,
    );
    if (existingLesson)
        return errorResponse(
            res,
            "Lesson with this order already exists in this section",
            400,
        );

    if (req.file) {
        const duration = await getVideoDuration(req.file.path);

        const uploadResult = await uploadToDrive(req.file);
        const videoUrl = uploadResult.fileId;

        const newLessonData = {
            ...req.body,
            video_url: videoUrl,
            duration: duration,
        };

        const newLesson = await Lesson.create(newLessonData);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return successResponse(
            res,
            newLesson,
            "Lesson created successfully",
            201,
        );
    } else {
        return errorResponse(res, "Video file is required", 400);
    }
});

const getLessonsBySection = asyncHandler(async (req, res, next) => {
    const { course_id, section_order } = req.params;
    const user_id = req.user?.user_id;
    const role = req.user?.role;

    const lessons = await Lesson.findBySection(course_id, section_order);

    const course = await Course.findById(course_id);
    if (!course) return errorResponse(res, "Course not found", 404);

    const isAuthorized = role === "admin" || course.instructor_id === user_id || (user_id && await Enrollment.isEnrolled(user_id, course_id));

    if (isAuthorized) {
        return successResponse(res, lessons);
    } else {
        // Only return basic info if not enrolled
        const publicLessons = lessons.map(({ video_url, description, duration, ...lessonData }) => lessonData);
        return successResponse(res, publicLessons);
    }
});

const getLessonDetails = asyncHandler(async (req, res, next) => {
    const { course_id, section_order, lesson_order } = req.params;
    const lesson = await Lesson.findOne(
        course_id,
        section_order,
        lesson_order,
    );
    if (lesson) {
        return successResponse(res, lesson);
    } else {
        return errorResponse(res, "Lesson not found", 404);
    }
});

const updateLesson = asyncHandler(async (req, res, next) => {
    const { course_id, section_order, lesson_order } = req.params;

    const course = await Course.findById(course_id);
    if (!course) return errorResponse(res, "Course not found", 404);

    if (
        req.user.role !== "admin" &&
        course.instructor_id !== req.user.user_id
    ) {
        return errorResponse(
            res,
            "Forbidden: You are not authorized to update this lesson",
            403,
        );
    }

    const existingLesson = await Lesson.findOne(
        course_id,
        section_order,
        lesson_order,
    );
    if (!existingLesson) return errorResponse(res, "Lesson not found", 404);

    const updateData = { ...req.body };

    let newVideoUrl = null;
    if (req.file) {
        const duration = await getVideoDuration(req.file.path);

        const uploadResult = await uploadToDrive(req.file);
        newVideoUrl = uploadResult.fileId;

        updateData.video_url = newVideoUrl;
        updateData.duration = duration;

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }

    const result = await Lesson.update(
        course_id,
        section_order,
        lesson_order,
        updateData,
    );
    if (result) {
        if (newVideoUrl && existingLesson.video_url) {
            try {
                await deleteFromDrive(existingLesson.video_url);
            } catch (err) {
                console.error(
                    "Failed to delete old video from drive:",
                    err,
                );
            }
        }
        return successResponse(res, null, "Lesson updated successfully");
    } else {
        if (newVideoUrl) await deleteFromDrive(newVideoUrl);
        return errorResponse(res, "Lesson not found", 404);
    }
});

const deleteLesson = asyncHandler(async (req, res, next) => {
    const { course_id, section_order, lesson_order } = req.params;

    const course = await Course.findById(course_id);
    if (!course) return errorResponse(res, "Course not found", 404);

    if (
        req.user.role !== "admin" &&
        course.instructor_id !== req.user.user_id
    ) {
        return errorResponse(
            res,
            "Forbidden: You are not authorized to delete this lesson",
            403,
        );
    }

    const lesson = await Lesson.findOne(
        course_id,
        section_order,
        lesson_order,
    );
    if (!lesson) return errorResponse(res, "Lesson not found", 404);

    const result = await Lesson.delete(
        course_id,
        section_order,
        lesson_order,
    );
    if (result) {
        if (lesson.video_url) {
            try {
                await deleteFromDrive(lesson.video_url);
            } catch (err) {
                console.error(
                    "Failed to delete lesson video from drive:",
                    err,
                );
            }
        }
        return successResponse(res, null, "Lesson deleted successfully");
    } else {
        return errorResponse(res, "Lesson not found", 404);
    }
});

const completeLesson = asyncHandler(async (req, res, next) => {
    const { course_id, section_order, lesson_order } = req.params;
    const user_id = req.user.user_id;

    const lesson = await Lesson.findOne(
        course_id,
        section_order,
        lesson_order,
    );
    if (!lesson) return errorResponse(res, "Lesson not found", 404);

    await Lesson.completeLesson(
        user_id,
        course_id,
        section_order,
        lesson_order,
    );
    return successResponse(res, null, "Lesson marked as completed");
});

export {
    createLesson,
    getLessonsBySection,
    getLessonDetails,
    updateLesson,
    deleteLesson,
    completeLesson,
};
