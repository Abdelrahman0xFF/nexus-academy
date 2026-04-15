import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";

export const verifyEnrollment = async (req, res, next) => {
    try {
        const { course_id } = req.params;
        const user_id = req.user.user_id;
        const role = req.user.role;

        if (role === 'admin') return next();

        const course = await Course.findById(course_id);
        if (course && course.instructor_id === user_id) return next();

        const isEnrolled = await Enrollment.isEnrolled(user_id, course_id);
        if (!isEnrolled) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
