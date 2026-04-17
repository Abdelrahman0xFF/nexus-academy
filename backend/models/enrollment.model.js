import { sql, poolPromise } from "../config/db.config.js";

class Enrollment {
    static async create(user_id, course_id, payment_method) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .input("course_id", sql.Int, course_id)
                .input("payment_method", sql.NVarChar, payment_method).query(`
                    INSERT INTO enrollments (course_id, user_id, payment_method, payment_status, enrollment_cost)
                    SELECT 
                        @course_id, 
                        @user_id, 
                        ISNULL(@payment_method, 'card'),
                        'paid',
                        ISNULL(price, original_price)
                    FROM courses
                    WHERE course_id = @course_id;
                `);

            if (result.rowsAffected[0] > 0) {
                return { user_id, course_id, message: "Enrolled successfully" };
            }
            return null;
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

    static async getEnrollmentsByCourseId(course_id, page = 1, limit = 10, sortBy = "enrolled_at", order = "DESC") {
        try {
            const offset = (page - 1) * limit;
            const pool = await poolPromise;

            const allowedSortColumns = ["enrolled_at", "user_id", "enrollment_cost"];
            if (!allowedSortColumns.includes(sortBy)) sortBy = "enrolled_at";
            const validOrder = ["ASC", "DESC"].includes(order.toUpperCase()) ? order.toUpperCase() : "DESC";

            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id)
                .input("limit", sql.Int, limit)
                .input("offset", sql.Int, offset).query(`
                    SELECT * FROM enrollments
                    WHERE course_id = @course_id
                    ORDER BY ${sortBy} ${validOrder}
                    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
                `);
            return result.recordset;
        } catch (err) {
            console.error("Error fetching enrollments: ", err);
            throw err;
        }
    }

    static async findByUserId(user_id, page = 1, limit = 10, sortBy = "enrolled_at", order = "DESC") {
        try {
            const offset = (page - 1) * limit;
            const pool = await poolPromise;

            const allowedSortColumns = ["enrolled_at", "course_id", "enrollment_cost"];
            if (!allowedSortColumns.includes(sortBy)) sortBy = "enrolled_at";
            const validOrder = ["ASC", "DESC"].includes(order.toUpperCase()) ? order.toUpperCase() : "DESC";

            const result = await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .input("limit", sql.Int, limit)
                .input("offset", sql.Int, offset).query(`
                SELECT 
                    e.course_id,
                    e.user_id,
                    e.enrolled_at,
                    e.payment_method,
                    e.payment_status,
                    e.enrollment_cost,
                    c.title, 
                    c.thumbnail_url, 
                    c.instructor_id,
                    u.first_name AS instructor_first_name, 
                    u.last_name AS instructor_last_name,
                    ISNULL((
                        SELECT 
                            CASE 
                                WHEN COUNT(*) = 0 THEN 0 
                                ELSE (CAST((SELECT COUNT(*) FROM user_lessons WHERE user_id = @user_id AND course_id = e.course_id) AS FLOAT) / COUNT(*) * 100)
                            END
                        FROM lessons 
                        WHERE course_id = e.course_id
                    ), 0) AS progress
                FROM enrollments e
                JOIN courses c ON e.course_id = c.course_id
                JOIN users u ON c.instructor_id = u.user_id
                WHERE e.user_id = @user_id
                ORDER BY e.${sortBy} ${validOrder}
                OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
            `);
            return result.recordset;
        } catch (err) {
            console.error("Error fetching user enrollments: ", err);
            throw err;
        }
    }

    static async delete(user_id, course_id) {
        try {
            const pool = await poolPromise;
            await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .input("course_id", sql.Int, course_id).query(`
                    DELETE FROM user_lessons WHERE user_id = @user_id AND course_id = @course_id;
                    DELETE FROM enrollments WHERE user_id = @user_id AND course_id = @course_id;
                `);
            return true;
        } catch (err) {
            console.error("Error deleting enrollment: ", err);
            throw err;
        }
    }
}

export default Enrollment;
