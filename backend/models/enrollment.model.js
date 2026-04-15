import { sql, poolPromise } from "../config/db.config.js";

class Enrollment {
    static async create(userId, courseId, paymentMethod = 'card', paymentStatus = 'ok') {
        try {
            const pool = await poolPromise;
            await pool
                .request()
                .input("user_id", sql.Int, userId)
                .input("course_id", sql.Int, courseId)
                .input("payment_method", sql.NVarChar, paymentMethod)
                .input("payment_status", sql.NVarChar, paymentStatus)
                .query(`
                    INSERT INTO enrollments (user_id, course_id, payment_method, payment_status)
                    VALUES (@user_id, @course_id, @payment_method, @payment_status);
                `);
            return { userId, courseId, message: "Enrolled successfully" };
        } catch (err) {
            console.error("Error creating enrollment: ", err);
            throw err;
        }
    }


    static async isEnrolled(user_id, course_id) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .input("course_id", sql.Int, course_id)
                .query(`
                    SELECT 1 FROM enrollments 
                    WHERE user_id = @user_id AND course_id = @course_id
                `);
            return result.recordset.length > 0;
        } catch (err) {
            console.error("Error checking enrollment: ", err);
            throw err;
        }
    }

    static async getProgress(user_id, course_id) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .input("course_id", sql.Int, course_id)
                .query(`
                    SELECT 
                        (CAST(COUNT(*) AS FLOAT) / 
                        (SELECT COUNT(*) FROM lessons WHERE course_id = @course_id) * 100) AS progress
                    FROM user_lessons
                    WHERE user_id = @user_id AND course_id = @course_id
                `);
            return result.recordset[0].progress || 0;
        } catch (err) {
            console.error("Error getting progress: ", err);
            throw err;
        }
    }
}

export default Enrollment;
