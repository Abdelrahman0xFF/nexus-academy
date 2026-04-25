import { sql, poolPromise } from "../config/db.config.js";

class Course {
    constructor(course) {
        this.course_id = course.course_id;
        this.category_id = course.category_id;
        this.instructor_id = course.instructor_id;
        this.title = course.title;
        this.description = course.description;
        this.price = course.price;
        this.original_price = course.original_price;
        this.thumbnail_url = course.thumbnail_url;
        this.level = course.level;
        this.duration = course.duration;
        this.is_available = course.is_available ?? true;
        this.rating = course.rating ?? 0;
    }

    static async create(newCourse) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("category_id", sql.Int, newCourse.category_id)
                .input("instructor_id", sql.Int, newCourse.instructor_id)
                .input("title", sql.NVarChar, newCourse.title)
                .input("description", sql.NVarChar, newCourse.description)
                .input("price", sql.Decimal(10, 2), newCourse.price)
                .input(
                    "original_price",
                    sql.Decimal(10, 2),
                    newCourse.original_price,
                )
                .input("thumbnail_url", sql.VarChar, newCourse.thumbnail_url)
                .input("level", sql.NVarChar, newCourse.level)
                .input("is_available", sql.Bit, newCourse.is_available ?? 1)
                .query(`
                    INSERT INTO courses (
                        category_id, instructor_id, title, description,
                        price, original_price, thumbnail_url, level, is_available
                    )
                    VALUES (
                        @category_id, @instructor_id, @title, @description,
                        @price, @original_price, @thumbnail_url, @level, @is_available
                    );

                    SELECT course_id FROM courses WHERE course_id = SCOPE_IDENTITY();
                `);
            return {
                ...newCourse,
                course_id: result.recordset[0].course_id,
            };
        } catch (err) {
            console.error("Error creating course: ", err);
            throw err;
        }
    }

    static async findById(course_id, userId = null, isAdmin = false) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id)
                .input("userId", sql.Int, userId)
                .input("isAdmin", sql.Bit, isAdmin ? 1 : 0).query(`
                    SELECT c.*, cat.name as category_name, (u.first_name + ' ' + u.last_name) as instructor_name,
                    u.avatar_url as instructor_avatar,
                    r.rating,
                    r.review_count,
                    ISNULL(l.duration, 0) AS duration,
                    e_count.students_count,
                    CASE 
                        WHEN @userId IS NOT NULL AND EXISTS (SELECT 1 FROM enrollments WHERE user_id = @userId AND course_id = @course_id) THEN 1
                        ELSE 0
                    END AS is_enrolled
                    FROM courses c
                    LEFT JOIN categories cat ON c.category_id = cat.category_id
                    LEFT JOIN users u ON c.instructor_id = u.user_id
                    LEFT JOIN (
                        SELECT course_id, 
                               AVG(CAST(rating AS FLOAT)) AS rating, 
                               COUNT(*) AS review_count 
                        FROM reviews 
                        GROUP BY course_id
                    ) r ON c.course_id = r.course_id
                    LEFT JOIN (
                        SELECT course_id, SUM(duration) AS duration 
                        FROM lessons 
                        GROUP BY course_id
                    ) l ON c.course_id = l.course_id
                    LEFT JOIN (
                        SELECT course_id, COUNT(*) AS students_count 
                        FROM enrollments 
                        GROUP BY course_id
                    ) e_count ON c.course_id = e_count.course_id
                    WHERE c.course_id = @course_id
                    AND (c.is_available = 1 OR @isAdmin = 1 OR c.instructor_id = @userId)
                `);
            return result.recordset[0];
        } catch (err) {
            console.error("Error finding course by ID: ", err);
            throw err;
        }
    }

    static async find(
        page,
        limit,
        userId = null,
        isAdmin = false,
        filters = {},
        sortBy = "created_at",
        order = "ASC"
    ) {
        try {
            const offset = (page - 1) * limit;
            const pool = await poolPromise;
            const request = pool.request();

            request.input("limit", sql.Int, limit);
            request.input("offset", sql.Int, offset);
            request.input("userId", sql.Int, userId);
            request.input("isAdmin", sql.Bit, isAdmin ? 1 : 0);

            let whereClause =
                "WHERE (c.is_available = 1 OR @isAdmin = 1 OR c.instructor_id = @userId)";

            if (filters.search) {
                request.input("search", sql.NVarChar, `%${filters.search}%`);
                whereClause +=
                    " AND (c.title LIKE @search OR c.description LIKE @search)";
            }

            if (filters.category_id) {
                request.input("category_id", sql.Int, filters.category_id);
                whereClause += " AND c.category_id = @category_id";
            }

            if (filters.level) {
                request.input("level", sql.NVarChar, filters.level);
                whereClause += " AND c.level = @level";
            }

            const sortColumnMap = {
                title: "c.title",
                price: "c.price",
                rating: "rating",
                duration: "duration",
                created_at: "c.created_at"
            };
            const sortColumn = sortColumnMap[sortBy] || "c.created_at";
            const validOrder = ["ASC", "DESC"].includes(order.toUpperCase()) ? order.toUpperCase() : "ASC";

            const query = `
                SELECT c.*, cat.name as category_name, (u.first_name + ' ' + u.last_name) as instructor_name,
                r.rating,
                r.review_count,
                ISNULL(l.duration, 0) AS duration,
                e_count.students_count
                FROM courses c
                LEFT JOIN categories cat ON c.category_id = cat.category_id
                LEFT JOIN users u ON c.instructor_id = u.user_id
                LEFT JOIN (
                    SELECT course_id, 
                           AVG(CAST(rating AS FLOAT)) AS rating, 
                           COUNT(*) AS review_count 
                    FROM reviews 
                    GROUP BY course_id
                ) r ON c.course_id = r.course_id
                LEFT JOIN (
                    SELECT course_id, SUM(duration) AS duration 
                    FROM lessons 
                    GROUP BY course_id
                ) l ON c.course_id = l.course_id
                LEFT JOIN (
                    SELECT course_id, COUNT(*) AS students_count 
                    FROM enrollments 
                    GROUP BY course_id
                ) e_count ON c.course_id = e_count.course_id
                ${whereClause}
                ORDER BY ${sortColumn} ${validOrder} 
                OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;

                SELECT COUNT(*) as total FROM courses c ${whereClause};
            `;

            const result = await request.query(query);
            return {
                courses: result.recordsets[0],
                total: result.recordsets[1][0].total
            };
        } catch (err) {
            console.error("Error finding courses: ", err);
            throw err;
        }
    }

    static async findByCategoryId(
        category_id,
        page = 1,
        limit = 10,
        userId = null,
        isAdmin = false,
    ) {
        try {
            const offset = (page - 1) * limit;
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("category_id", sql.Int, category_id)
                .input("limit", sql.Int, limit)
                .input("offset", sql.Int, offset)
                .input("userId", sql.Int, userId)
                .input("isAdmin", sql.Bit, isAdmin ? 1 : 0).query(`
                    SELECT c.*, 
                    r.rating,
                    ISNULL(l.duration, 0) AS duration
                    FROM courses c
                    LEFT JOIN (
                        SELECT course_id, AVG(CAST(rating AS FLOAT)) AS rating 
                        FROM reviews 
                        GROUP BY course_id
                    ) r ON c.course_id = r.course_id
                    LEFT JOIN (
                        SELECT course_id, SUM(duration) AS duration 
                        FROM lessons 
                        GROUP BY course_id
                    ) l ON c.course_id = l.course_id
                    WHERE c.category_id = @category_id
                    AND (c.is_available = 1 OR @isAdmin = 1 OR c.instructor_id = @userId)
                    ORDER BY c.course_id 
                    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
                `);
            return result.recordset;
        } catch (err) {
            console.error("Error finding courses by category ID: ", err);
            throw err;
        }
    }

    static async findByInstructorId(
        instructor_id,
        userId = null,
        isAdmin = false,
    ) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("instructor_id", sql.Int, instructor_id)
                .input("userId", sql.Int, userId)
                .input("isAdmin", sql.Bit, isAdmin ? 1 : 0).query(`
                    SELECT c.*, 
                    r.rating,
                    ISNULL(l.duration, 0) AS duration
                    FROM courses c
                    LEFT JOIN (
                        SELECT course_id, AVG(CAST(rating AS FLOAT)) AS rating 
                        FROM reviews 
                        GROUP BY course_id
                    ) r ON c.course_id = r.course_id
                    LEFT JOIN (
                        SELECT course_id, SUM(duration) AS duration 
                        FROM lessons 
                        GROUP BY course_id
                    ) l ON c.course_id = l.course_id
                    WHERE c.instructor_id = @instructor_id
                    AND (c.is_available = 1 OR @isAdmin = 1 OR c.instructor_id = @userId)
                `);
            return result.recordset;
        } catch (err) {
            console.error("Error finding courses by instructor ID: ", err);
            throw err;
        }
    }

    static async update(course_id, updatedCourse) {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            request.input("course_id", sql.Int, course_id);

            let query = "UPDATE courses SET ";
            const updates = [];
            for (const [key, value] of Object.entries(updatedCourse)) {
                if (
                    value !== undefined &&
                    !["course_id", "duration", "rating"].includes(key)
                ) {
                    if (key === "is_available") {
                        request.input(key, sql.Bit, value ? 1 : 0);
                    } else {
                        request.input(key, value);
                    }
                    updates.push(`${key} = @${key}`);
                }
            }

            if (updates.length === 0)
                return { message: "No data provided to update" };

            query += updates.join(", ");
            query += " WHERE course_id = @course_id";

            const result = await request.query(query);

            return result.rowsAffected[0] > 0
                ? { message: "Course updated successfully" }
                : null;
        } catch (err) {
            console.error("Error updating course: ", err);
            throw err;
        }
    }

    static async delete(course_id) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id).query(`
                    DELETE FROM reviews WHERE course_id = @course_id;
                    DELETE FROM user_lessons WHERE course_id = @course_id;
                    DELETE FROM lessons WHERE course_id = @course_id;
                    DELETE FROM sections WHERE course_id = @course_id;
                    DELETE FROM certificates WHERE course_id = @course_id;
                    DELETE FROM enrollments WHERE course_id = @course_id;
                    DELETE FROM courses WHERE course_id = @course_id;
                `);
            return result.rowsAffected[result.rowsAffected.length - 1] > 0;
        } catch (err) {
            console.error("Error deleting course: ", err);
            throw err;
        }
    }

    static async getCourseStats(course_id) {
        try {
            const pool = await poolPromise;

            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id).query(`
                    SELECT 
                        ISNULL(e.students, 0) AS students,
                        ISNULL(e.revenue, 0) AS revenue,
                        r.rating
                    FROM (SELECT 1 as dummy) d
                    LEFT JOIN (
                        SELECT course_id, COUNT(user_id) as students, SUM(enrollment_cost) as revenue
                        FROM enrollments
                        WHERE course_id = @course_id
                        GROUP BY course_id
                    ) e ON 1=1
                    LEFT JOIN (
                        SELECT course_id, AVG(CAST(rating AS FLOAT)) as rating
                        FROM reviews
                        WHERE course_id = @course_id
                        GROUP BY course_id
                    ) r ON 1=1
                `);
            return result.recordset[0];
        } catch (err) {
            console.error("Error getting course stats: ", err);
            throw err;
        }
    }
}

export default Course;
