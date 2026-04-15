import Enrollment from "../models/enrollment.model.js";
import { enrollmentSchema } from "../validators/enrollment.validator.js";

export const enroll = async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res
                .status(403)
                .json({ message: "Only students can enroll in courses" });
        }

        const { error } = enrollmentSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        const { course_id, payment_method = "card" } = req.body;
        const user_id = req.user.user_id;

        const alreadyEnrolled = await Enrollment.isEnrolled(user_id, course_id);
        if (alreadyEnrolled) {
            return res
                .status(400)
                .json({ message: "Already enrolled in this course" });
        }

        await Enrollment.create(user_id, course_id, payment_method, "ok");
        res.status(201).json({ message: "Enrolled successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getProgress = async (req, res) => {
    try {
        const { course_id } = req.params;
        const user_id = req.user.user_id;

        const progress = await Enrollment.getProgress(user_id, course_id);
        res.status(200).json({ progress });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
