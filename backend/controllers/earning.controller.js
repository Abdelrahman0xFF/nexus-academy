import { sql, poolPromise } from "../config/db.config.js";
import { successResponse } from "../utils/response.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getEarnings = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;
    const is_admin = req.user.role === "admin";
    const pool = await poolPromise;

    let query,
        params = {};

    if (is_admin) {
        query = `
            SELECT 
                u.user_id, 
                u.first_name, 
                u.last_name, 
                SUM(e.enrollment_cost * 0.3) as earning,
                SUM(e.enrollment_cost * 0.7) as instructor_earning
            FROM users u
            JOIN courses c ON u.user_id = c.instructor_id
            JOIN enrollments e ON c.course_id = e.course_id
            GROUP BY u.user_id, u.first_name, u.last_name
        `;
    } else {
        query = `
            SELECT 
                c.course_id, 
                c.title, 
                COUNT(e.user_id) as total_students, 
                SUM(e.enrollment_cost * 0.7) as earning
            FROM courses c
            LEFT JOIN enrollments e ON c.course_id = e.course_id
            WHERE c.instructor_id = @instructor_id
            GROUP BY c.course_id, c.title
        `;
        params.instructor_id = user_id;
    }

    const request = pool.request();
    if (params.instructor_id)
        request.input("instructor_id", sql.Int, params.instructor_id);

    const result = await request.query(query);

    const total_revenue = result.recordset.reduce(
        (sum, item) => sum + (item.earning || 0),
        0,
    );

    return successResponse(res, {
        total_revenue,
        details: result.recordset,
    });
});
