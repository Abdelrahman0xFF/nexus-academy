import { sql, poolPromise } from "../config/db.config.js";

class Lesson {
    constructor(lesson) {
        this.course_id = lesson.course_id;
        this.section_order = lesson.section_order;
        this.lesson_order = lesson.lesson_order;
        this.title = lesson.title;
        this.description = lesson.description;
        this.video_url = lesson.video_url;
        this.duration = lesson.duration || 0;
    }

    static async create(newLesson) {
        try {
            const pool = await poolPromise;
            await pool
                .request()
                .input("course_id", sql.Int, newLesson.course_id)
                .input("section_order", sql.Int, newLesson.section_order)
                .input("lesson_order", sql.Int, newLesson.lesson_order)
                .input("title", sql.NVarChar, newLesson.title)
                .input("description", sql.NVarChar, newLesson.description)
                .input("video_url", sql.NVarChar, newLesson.video_url)
                .input("duration", sql.Int, newLesson.duration).query(`
                    INSERT INTO lessons (course_id, section_order, lesson_order, title, description, video_url, duration)
                    VALUES (@course_id, @section_order, @lesson_order, @title, @description, @video_url, @duration);
                `);
            return newLesson;
        } catch (err) {
            console.error("Error creating lesson: ", err);
            throw err;
        }
    }

    static async findBySection(course_id, section_order) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id)
                .input("section_order", sql.Int, section_order)
                .query(
                    "SELECT * FROM lessons WHERE course_id = @course_id AND section_order = @section_order ORDER BY lesson_order ASC",
                );
            return result.recordset;
        } catch (err) {
            console.error("Error finding lessons by section: ", err);
            throw err;
        }
    }

    static async findByCourseId(course_id) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id)
                .query(
                    "SELECT * FROM lessons WHERE course_id = @course_id ORDER BY section_order ASC, lesson_order ASC",
                );
            return result.recordset;
        } catch (err) {
            console.error("Error finding lessons by course ID: ", err);
            throw err;
        }
    }

    static async findOne(course_id, section_order, lesson_order) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id)
                .input("section_order", sql.Int, section_order)
                .input("lesson_order", sql.Int, lesson_order)
                .query(
                    "SELECT * FROM lessons WHERE course_id = @course_id AND section_order = @section_order AND lesson_order = @lesson_order",
                );
            return result.recordset[0];
        } catch (err) {
            console.error("Error finding lesson: ", err);
            throw err;
        }
    }

    static async update(course_id, section_order, lesson_order, updatedLesson) {
        try {
            const pool = await poolPromise;
            const request = pool.request();
            request.input("course_id", sql.Int, course_id);
            request.input("section_order", sql.Int, section_order);
            request.input("lesson_order", sql.Int, lesson_order);

            let query = "UPDATE lessons SET ";
            const updates = [];
            for (const [key, value] of Object.entries(updatedLesson)) {
                if (
                    value !== undefined &&
                    !["course_id", "section_order", "lesson_order"].includes(
                        key,
                    )
                ) {
                    request.input(key, value);
                    updates.push(`${key} = @${key}`);
                }
            }

            if (updates.length === 0) return null;

            query += updates.join(", ");
            query +=
                " WHERE course_id = @course_id AND section_order = @section_order AND lesson_order = @lesson_order";

            const result = await request.query(query);
            return result.rowsAffected[0] > 0;
        } catch (err) {
            console.error("Error updating lesson: ", err);
            throw err;
        }
    }

    static async delete(course_id, section_order, lesson_order) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id)
                .input("section_order", sql.Int, section_order)
                .input("lesson_order", sql.Int, lesson_order)
                .query(
                    "DELETE FROM lessons WHERE course_id = @course_id AND section_order = @section_order AND lesson_order = @lesson_order",
                );
            return result.rowsAffected[0] > 0;
        } catch (err) {
            console.error("Error deleting lesson: ", err);
            throw err;
        }
    }

    static async completeLesson(
        user_id,
        course_id,
        section_order,
        lesson_order,
    ) {
        try {
            const pool = await poolPromise;
            await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .input("course_id", sql.Int, course_id)
                .input("section_order", sql.Int, section_order)
                .input("lesson_order", sql.Int, lesson_order).query(`
                    IF NOT EXISTS (
                        SELECT 1 FROM user_lessons 
                        WHERE user_id = @user_id AND course_id = @course_id 
                        AND section_order = @section_order AND lesson_order = @lesson_order
                    )
                    BEGIN
                        INSERT INTO user_lessons (user_id, course_id, section_order, lesson_order)
                        VALUES (@user_id, @course_id, @section_order, @lesson_order);
                    END
                `);
            return true;
        } catch (err) {
            console.error("Error completing lesson: ", err);
            throw err;
        }
    }

    static async getCompletedLessons(user_id, course_id = null) {
        try {
            const pool = await poolPromise;
            const request = pool.request().input("user_id", sql.Int, user_id);
            let query = "SELECT * FROM user_lessons WHERE user_id = @user_id";

            if (course_id) {
                request.input("course_id", sql.Int, course_id);
                query += " AND course_id = @course_id";
            }

            query += " ORDER BY section_order ASC, lesson_order ASC";

            const result = await request.query(query);
            return result.recordset;
        } catch (err) {
            console.error("Error getting completed lessons: ", err);
            throw err;
        }
    }
}

export default Lesson;
