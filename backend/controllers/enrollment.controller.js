import Enrollment from "../models/enrollment.model.js";
import { enrollmentSchema } from "../validators/enrollment.validator.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const enroll = async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return errorResponse(res, "Only students can enroll in courses", 403);
        }

        const { error } = enrollmentSchema.validate(req.body);
        if (error)
            return errorResponse(res, error.details[0].message, 400);

        const { course_id, payment_method = "card" } = req.body;
        const user_id = req.user.user_id;

        const alreadyEnrolled = await Enrollment.isEnrolled(user_id, course_id);
        if (alreadyEnrolled) {
            return errorResponse(res, "Already enrolled in this course", 400);
        }

        await Enrollment.create(user_id, course_id, payment_method, "ok");
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
