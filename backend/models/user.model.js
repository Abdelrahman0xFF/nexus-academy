import { sql, poolPromise } from "../config/db.config.js";

class User {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.hashed_password = user.hashed_password;
        this.avatar_url = user.avatar_url;
        this.role = user.role;
        this.title = user.title;
        this.bio = user.bio;
        this.is_verified = user.is_verified ?? false;
        this.otp = user.otp ?? null;
        this.otp_expires = user.otp_expires ?? null;
    }

    static async create(newUser) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("first_name", sql.NVarChar, newUser.first_name)
                .input("last_name", sql.NVarChar, newUser.last_name)
                .input("email", sql.NVarChar, newUser.email)
                .input("hashed_password", sql.NVarChar, newUser.hashed_password)
                .input("avatar_url", sql.NVarChar, newUser.avatar_url)
                .input("title", sql.NVarChar, newUser.title)
                .input("bio", sql.NVarChar, newUser.bio)
                .input("otp", sql.NVarChar, newUser.otp)
                .input("otp_expires", sql.BigInt, newUser.otp_expires).query(`
                    INSERT INTO users (
                        first_name, last_name, email, hashed_password,
                        avatar_url, title, bio, otp, otp_expires
                    )
                    VALUES (
                        @first_name, @last_name, @email, @hashed_password,
                        @avatar_url, @title, @bio, @otp, @otp_expires
                    );

                    SELECT user_id, role, is_verified FROM users WHERE user_id = SCOPE_IDENTITY();
                `);
            return {
                ...newUser,
                user_id: result.recordset[0].user_id,
                role: result.recordset[0].role,
                is_verified: result.recordset[0].is_verified,
            };
        } catch (err) {
            console.error("Error creating user: ", err);
            throw err;
        }
    }

    static async findById(user_id) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .query("SELECT * FROM users WHERE user_id = @user_id");
            return result.recordset[0];
        } catch (err) {
            console.error("Error finding user by ID: ", err);
            throw err;
        }
    }

    static async findByEmail(email) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("email", sql.NVarChar, email)
                .query("SELECT * FROM users WHERE email = @email");
            return result.recordset[0];
        } catch (err) {
            console.error("Error finding user by email: ", err);
            throw err;
        }
    }

    static async find(page, limit) {
        try {
            const offset = (page - 1) * limit;
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("limit", sql.Int, limit)
                .input("offset", sql.Int, offset)
                .query(
                    "SELECT * FROM users ORDER BY user_id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY",
                );
            return result.recordset;
        } catch (err) {
            console.error("Error finding users: ", err);
            throw err;
        }
    }

    static async update(user_id, updatedUser) {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            request.input("user_id", sql.Int, user_id);

            let query = "UPDATE users SET ";
            const updates = [];
            for (const [key, value] of Object.entries(updatedUser)) {
                if (value !== undefined && key !== "user_id") {
                    if (key === "is_verified") {
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
            query += " WHERE user_id = @user_id";

            const result = await request.query(query);

            return result.rowsAffected[0] > 0
                ? { message: "User updated successfully" }
                : null;
        } catch (err) {
            console.error("Error updating user: ", err);
            throw err;
        }
    }

    static async delete(user_id) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("user_id", sql.Int, user_id)
                .query("DELETE FROM users WHERE user_id = @user_id");
            return result.rowsAffected[0] > 0;
        } catch (err) {
            console.error("Error deleting user: ", err);
            throw err;
        }
    }

    static async updateOTP(email, hashedOtp, otpExpires) {
        try {
            const pool = await poolPromise;
            await pool
                .request()
                .input("email", sql.NVarChar, email)
                .input("otp", sql.NVarChar, hashedOtp)
                .input("otp_expires", sql.BigInt, otpExpires).query(`
                    UPDATE users 
                    SET otp = @otp, otp_expires = @otp_expires 
                    WHERE email = @email
                `);
        } catch (err) {
            console.error("Error updating OTP: ", err);
            throw err;
        }
    }

    static async verify(email) {
        try {
            const pool = await poolPromise;
            await pool.request().input("email", sql.NVarChar, email).query(`
                    UPDATE users 
                    SET is_verified = 1, otp = NULL, otp_expires = NULL 
                    WHERE email = @email
                `);
        } catch (err) {
            console.error("Error verifying user: ", err);
            throw err;
        }
    }

    static async deleteUnverified(email) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("email", sql.NVarChar, email).query(`
                    DELETE FROM users 
                    WHERE email = @email AND is_verified = 0
                `);
            return result.rowsAffected[0] > 0;
        } catch (err) {
            console.error("Error deleting unverified user: ", err);
            throw err;
        }
    }
}

export default User;
