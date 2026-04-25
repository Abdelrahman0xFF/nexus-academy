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
                        CASE 
                            WHEN l.total = 0 THEN 0 
                            ELSE (CAST(ISNULL(ul.completed, 0) AS FLOAT) / l.total * 100) 
                        END AS progress
                    FROM (
                        SELECT COUNT(*) as total 
                        FROM lessons 
                        WHERE course_id = @course_id
                    ) l
                    CROSS JOIN (
                        SELECT COUNT(*) as completed 
                        FROM user_lessons 
                        WHERE user_id = @user_id AND course_id = @course_id
                    ) ul
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
                    SELECT e.*, u.first_name, u.last_name, u.avatar_url, u.email
                    FROM enrollments e
                    JOIN users u ON e.user_id = u.user_id
                    WHERE e.course_id = @course_id
                    ORDER BY e.${sortBy} ${validOrder}
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
                    cat.name AS category_name,
                    u.first_name AS instructor_first_name, 
                    u.last_name AS instructor_last_name,
                    CASE 
                        WHEN l_count.total = 0 THEN 0 
                        ELSE (CAST(ISNULL(ul_count.completed, 0) AS FLOAT) / l_count.total * 100) 
                    END AS progress
                FROM enrollments e
                JOIN courses c ON e.course_id = c.course_id
                JOIN users u ON c.instructor_id = u.user_id
                LEFT JOIN categories cat ON c.category_id = cat.category_id
                LEFT JOIN (
                    SELECT course_id, COUNT(*) as total 
                    FROM lessons 
                    GROUP BY course_id
                ) l_count ON e.course_id = l_count.course_id
                LEFT JOIN (
                    SELECT course_id, user_id, COUNT(*) as completed 
                    FROM user_lessons 
                    GROUP BY course_id, user_id
                ) ul_count ON e.course_id = ul_count.course_id AND e.user_id = ul_count.user_id
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
