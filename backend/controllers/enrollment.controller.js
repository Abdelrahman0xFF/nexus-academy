import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import { enrollmentSchema } from "../validators/enrollment.validator.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const enroll = async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return errorResponse(
                res,
                "Only students can enroll in courses",
                403,
            );
        }

        const { error } = enrollmentSchema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const { course_id, payment_method, patment_status } = req.body;
        const user_id = req.user.user_id;

        const alreadyEnrolled = await Enrollment.isEnrolled(user_id, course_id);
        if (alreadyEnrolled) {
            return errorResponse(res, "Already enrolled in this course", 400);
        }

        await Enrollment.create(
            user_id,
            course_id,
            payment_method,
            patment_status,
        );
        return successResponse(res, null, "Enrolled successfully", 201);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

export const getProgress = async (req, res) => {
    try {
        const { course_id } = req.params;
        const user_id = req.user.user_id;

        const progress = await Enrollment.getProgress(user_id, course_id);
        return successResponse(res, { progress });
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

export const getEnrollmentsByCourseId = async (req, res) => {
    try {
        const { course_id } = req.params;
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

        const enrollments = await Enrollment.getEnrollmentsByCourseId(course_id);
        return successResponse(res, enrollments);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};
