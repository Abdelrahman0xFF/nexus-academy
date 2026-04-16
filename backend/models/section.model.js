import { sql, poolPromise } from "../config/db.config.js";

class Section {
    constructor(section) {
        this.course_id = section.course_id;
        this.section_order = section.section_order;
        this.title = section.title;
    }

    static async create(newSection) {
        try {
            const pool = await poolPromise;
            await pool
                .request()
                .input("course_id", sql.Int, newSection.course_id)
                .input("section_order", sql.Int, newSection.section_order)
                .input("title", sql.NVarChar, newSection.title)
                .query(`
                    INSERT INTO sections (course_id, section_order, title)
                    VALUES (@course_id, @section_order, @title);
                `);
            return newSection;
        } catch (err) {
            console.error("Error creating section: ", err);
            throw err;
        }
    }

    static async findByCourseId(course_id) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id)
                .query("SELECT * FROM sections WHERE course_id = @course_id ORDER BY section_order");
            return result.recordset;
        } catch (err) {
            console.error("Error finding sections by course ID: ", err);
            throw err;
        }
    }

    static async findOne(course_id, section_order) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id)
                .input("section_order", sql.Int, section_order)
                .query("SELECT * FROM sections WHERE course_id = @course_id AND section_order = @section_order");
            return result.recordset[0];
        } catch (err) {
            console.error("Error finding section: ", err);
            throw err;
        }
    }

    static async update(course_id, section_order, updatedSection) {
        try {
            const pool = await poolPromise;
            const request = pool.request();
            request.input("course_id", sql.Int, course_id);
            request.input("section_order", sql.Int, section_order);

            let query = "UPDATE sections SET ";
            const updates = [];
            if (updatedSection.title) {
                request.input("title", sql.NVarChar, updatedSection.title);
                updates.push("title = @title");
            }
            
            if (updates.length === 0) return null;

            query += updates.join(", ");
            query += " WHERE course_id = @course_id AND section_order = @section_order";

            const result = await request.query(query);
            return result.rowsAffected[0] > 0;
        } catch (err) {
            console.error("Error updating section: ", err);
            throw err;
        }
    }

    static async delete(course_id, section_order) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("course_id", sql.Int, course_id)
                .input("section_order", sql.Int, section_order)
                .query(`
                    DELETE FROM user_lessons WHERE course_id = @course_id AND section_order = @section_order;
                    DELETE FROM lessons WHERE course_id = @course_id AND section_order = @section_order;
                    DELETE FROM sections WHERE course_id = @course_id AND section_order = @section_order;
                `);
            return result.rowsAffected[result.rowsAffected.length - 1] > 0;
        } catch (err) {
            console.error("Error deleting section: ", err);
            throw err;
        }
    }
}

export default Section;
