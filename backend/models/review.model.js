import { sql, poolPromise } from "../config/db.config.js";

class Review {
    static async create(user_id, course_id, rating, comment) {
        try {
            const pool = await poolPromise;
            await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .input("course_id", sql.Int, course_id)
                .input("rating", sql.Int, rating)
                .input("comment", sql.NVarChar, comment).query(`
                    INSERT INTO reviews (user_id, course_id, rating, comment)
                    VALUES (@user_id, @course_id, @rating, @comment)
                `);
            return true;
        } catch (err) {
            console.error("Error creating review: ", err);
            throw err;
        }
    }

    static async find(user_id, course_id) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .input("course_id", sql.Int, course_id)
                .query(
                    "SELECT * FROM reviews WHERE user_id = @user_id AND course_id = @course_id",
                );
            return result.recordset[0];
        } catch (err) {
            console.error("Error finding review: ", err);
            throw err;
        }
    }

    static async findByCourseId(course_id) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id).query(`
                    SELECT r.*, u.first_name, u.last_name 
                    FROM reviews r
                    JOIN users u ON r.user_id = u.user_id
                    WHERE r.course_id = @course_id
                    ORDER BY r.rating DESC
                `);
            return result.recordset;
        } catch (err) {
            console.error("Error finding reviews: ", err);
            throw err;
        }
    }

    static async update(user_id, course_id, rating, comment) {
        try {
            const pool = await poolPromise;
            await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .input("course_id", sql.Int, course_id)
                .input("rating", sql.Int, rating)
                .input("comment", sql.NVarChar, comment)
                .query(
                    "UPDATE reviews SET rating = @rating, comment = @comment WHERE user_id = @user_id AND course_id = @course_id",
                );
            return true;
        } catch (err) {
            console.error("Error updating review: ", err);
            throw err;
        }
    }

    static async delete(user_id, course_id) {
        try {
            const pool = await poolPromise;
            await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .input("course_id", sql.Int, course_id)
                .query(
                    "DELETE FROM reviews WHERE user_id = @user_id AND course_id = @course_id",
                );
            return true;
        } catch (err) {
            console.error("Error deleting review: ", err);
            throw err;
        }
    }
}

export default Review;
