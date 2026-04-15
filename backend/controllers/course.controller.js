import Course from "../models/course.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";
import { uploadToDrive, deleteFromDrive } from "../services/drive.service.js";
import {
    courseSchema,
    updateCourseSchema,
} from "../validators/course.validator.js";
import fs from "fs";

const createCourse = async (req, res) => {
    try {
        const { error } = courseSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        const { category_id } = req.body;

        const category = await Category.findById(category_id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        let courseThumbnailUrl = null;
        if (req.file) {
            const uploadResult = await uploadToDrive(req.file);
            courseThumbnailUrl = uploadResult.fileId;
        }

        const newCourse = await Course.create({
            ...req.body,
            instructor_id: req.user.user_id, // Automatically assign the instructor from authenticated user
            thumbnail_url: courseThumbnailUrl,
        });
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({
            message: "Internal Server error",
            error: err.message,
        });
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const getCourseById = async (req, res) => {
    try {
        const { course_id } = req.params;
        const course = await Course.findById(course_id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const courses = await Course.find(Number(page), Number(limit));
        res.json(courses);
    } catch (err) {
        res.status(500).json({
            message: "Internal Server error",
            error: err.message,
        });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { course_id } = req.params;
        const { error } = updateCourseSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        const existingCourse = await Course.findById(course_id);
        if (!existingCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Ownership: Admin or the course instructor
        if (
            req.user.role !== "admin" &&
            existingCourse.instructor_id !== req.user.user_id
        ) {
            return res.status(403).json({
                message:
                    "Forbidden: You are not authorized to update this course",
            });
        }

        const { category_id } = req.body;

        if (category_id) {
            const category = await Category.findById(category_id);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        const updateData = { ...req.body };
        delete updateData.instructor_id;

        if (req.file) {
            const uploadResult = await uploadToDrive(req.file);
            updateData.thumbnail_url = uploadResult.fileId;

            if (existingCourse.thumbnail_url) {
                try {
                    await deleteFromDrive(existingCourse.thumbnail_url);
                } catch (err) {
                    console.error(
                        "Failed to delete old thumbnail from drive:",
                        err,
                    );
                }
            }
        }

        const result = await Course.update(course_id, updateData);
        if (result) {
            res.json({ message: "Course updated successfully" });
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server error",
            error: err.message,
        });
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { course_id } = req.params;
        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (
            req.user.role !== "admin" &&
            course.instructor_id !== req.user.user_id
        ) {
            return res.status(403).json({
                message:
                    "Forbidden: You are not authorized to delete this course",
            });
        }

        const result = await Course.delete(course_id);
        if (result) {
            if (course.thumbnail_url) {
                try {
                    await deleteFromDrive(course.thumbnail_url);
                } catch (err) {
                    console.error(
                        "Failed to delete course thumbnail from drive:",
                        err,
                    );
                }
            }
            res.json({ message: "Course deleted successfully" });
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server error",
            error: err.message,
        });
    }
};

export {
    createCourse,
    getCourseById,
    getAllCourses,
    updateCourse,
    deleteCourse,
};
