import { sql, poolPromise } from "../config/db.config.js";

class Enrollment {
    static async create(user_id, course_id, payment_method, payment_status) {
        try {
            const pool = await poolPromise;
            await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .input("course_id", sql.Int, course_id)
                .input("payment_method", sql.NVarChar, payment_method)
                .input("payment_status", sql.NVarChar, payment_status).query(`
                    INSERT INTO enrollments (course_id, user_id, payment_method, payment_status, enrollment_cost)
                    SELECT 
                        @course_id, 
                        @user_id, 
                        ISNULL(@payment_method, 'card'),
                        ISNULL(@payment_status, 'paid'),
                        ISNULL(price, original_price)
                    FROM courses
                    WHERE course_id = @course_id;
                `);
            return { user_id, course_id, message: "Enrolled successfully" };
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
                .input("course_id", sql.Int, course_id).query(`
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
                .input("course_id", sql.Int, course_id).query(`
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

    static async getEnrollmentsByCourseId(course_id) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id).query(`
                    SELECT * FROM enrollments
                    WHERE course_id = @course_id
                `);
            return result.recordset;
        } catch (err) {
            console.error("Error fetching enrollments: ", err);
            throw err;
        }
    }
}

export default Enrollment;
