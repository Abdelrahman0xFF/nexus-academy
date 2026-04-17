import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import asyncHandler from "../utils/asyncHandler.js";

export const enroll = asyncHandler(async (req, res) => {
    if (req.user.role !== "user") {
        return errorResponse(res, "Only students can enroll in courses", 403);
    }

    const { course_id, payment_method } = req.body;
    const user_id = req.user.user_id;

    const course = await Course.findById(course_id);
    if (!course) {
        return errorResponse(res, "Course not found", 404);
    }

    if (course.instructor_id === user_id) {
        return errorResponse(res, "You cannot enroll in your own course", 400);
    }

    const alreadyEnrolled = await Enrollment.isEnrolled(user_id, course_id);
    if (alreadyEnrolled) {
        return errorResponse(res, "Already enrolled in this course", 400);
    }

    const result = await Enrollment.create(
        user_id,
        course_id,
        payment_method,
    );

    if (result) {
        return successResponse(res, null, "Enrolled successfully", 201);
    } else {
        return errorResponse(res, "Failed to enroll in course", 500);
    }
});

export const getProgress = asyncHandler(async (req, res) => {
    const { course_id } = req.params;
    const user_id = req.user.user_id;

    const enrolled = await Enrollment.isEnrolled(user_id, course_id);
    if (!enrolled) {
        return errorResponse(res, "Not enrolled in this course", 404);
    }

    const progress = await Enrollment.getProgress(user_id, course_id);
    return successResponse(res, { progress });
});

export const getEnrollmentsByCourseId = asyncHandler(async (req, res) => {
    const { course_id } = req.params;
    const { page = 1, limit = 10, sortBy = "Time", order = "DESC" } = req.query;
    const user_id = req.user.user_id;
    const isAdmin = req.user.role === "admin";

    const course = await Course.findById(course_id, user_id, isAdmin);
    if (!course) {
        return errorResponse(res, "Course not found", 404);
    }

    if (!isAdmin && course.instructor_id !== user_id) {
        return errorResponse(
            res,
            "Only the instructor of this course can view enrollments",
            403,
        );
    }

    const sortMap = {
        "Time": "enrolled_at",
        "User": "user_id",
        "Cost": "enrollment_cost"
    };

    const sortColumn = sortMap[sortBy] || "enrolled_at";

    const enrollments = await Enrollment.getEnrollmentsByCourseId(
        course_id,
        Number(page),
        Number(limit),
        sortColumn,
        order,
    );
    return successResponse(res, enrollments);
});

export const getMyEnrollments = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;
    const { page = 1, limit = 10, sortBy = "Time", order = "DESC" } = req.query;

    const sortMap = {
        "Time": "enrolled_at",
        "Course": "course_id",
        "Cost": "enrollment_cost"
    };

    const sortColumn = sortMap[sortBy] || "enrolled_at";

    const enrollments = await Enrollment.findByUserId(
        user_id,
        Number(page),
        Number(limit),
        sortColumn,
        order,
    );
    return successResponse(res, enrollments);
});

export const unenroll = asyncHandler(async (req, res) => {
    const { course_id } = req.params;
    const user_id = req.user.user_id;

    const enrolled = await Enrollment.isEnrolled(user_id, course_id);
    if (!enrolled) {
        return errorResponse(res, "Not enrolled in this course", 404);
    }

    await Enrollment.delete(user_id, course_id);
    return successResponse(res, null, "Unenrolled successfully");
});
