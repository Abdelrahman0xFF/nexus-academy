import Section from "../models/section.model.js";
import Lesson from "../models/lesson.model.js";
import Course from "../models/course.model.js";
import { deleteFromDrive } from "../services/drive.service.js";
import {
    sectionSchema,
    updateSectionSchema,
} from "../validators/section.validator.js";
import { successResponse, errorResponse } from "../utils/response.js";

const createSection = async (req, res, next) => {
    try {
        const { error } = sectionSchema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const { course_id, section_order } = req.body;

        const course = await Course.findById(course_id);
        if (!course) return errorResponse(res, "Course not found", 404);

        if (
            req.user.role !== "admin" &&
            course.instructor_id !== req.user.user_id
        ) {
            return errorResponse(
                res,
                "Forbidden: You are not authorized to add sections to this course",
                403,
            );
        }

        const existingSection = await Section.findOne(course_id, section_order);
        if (existingSection)
            return errorResponse(
                res,
                "Section with this order already exists",
                400,
            );

        const newSection = await Section.create(req.body);
        return successResponse(
            res,
            newSection,
            "Section created successfully",
            201,
        );
    } catch (err) {
        next(err);
    }
};

const getSectionsByCourseId = async (req, res, next) => {
    try {
        const { course_id } = req.params;
        const course = await Course.findById(course_id);

        if (!course) return errorResponse(res, "Course not found", 404);

        const sections = await Section.findByCourseId(course_id);
        const cleanSections = sections.map(
            ({ course_id: _, ...sectionData }) => sectionData,
        );

        return successResponse(res, cleanSections);
    } catch (err) {
        next(err);
    }
};

const updateSection = async (req, res, next) => {
    try {
        const { course_id, section_order } = req.params;
        const { error } = updateSectionSchema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const course = await Course.findById(course_id);
        if (!course) return errorResponse(res, "Course not found", 404);

        if (
            req.user.role !== "admin" &&
            course.instructor_id !== req.user.user_id
        ) {
            return errorResponse(
                res,
                "Forbidden: You are not authorized to update this section",
                403,
            );
        }

        const result = await Section.update(course_id, section_order, req.body);
        if (result) {
            return successResponse(res, null, "Section updated successfully");
        } else {
            return errorResponse(res, "Section not found", 404);
        }
    } catch (err) {
        next(err);
    }
};

const deleteSection = async (req, res, next) => {
    try {
        const { course_id, section_order } = req.params;

        const course = await Course.findById(course_id);
        if (!course) return errorResponse(res, "Course not found", 404);

        if (
            req.user.role !== "admin" &&
            course.instructor_id !== req.user.user_id
        ) {
            return errorResponse(
                res,
                "Forbidden: You are not authorized to delete this section",
                403,
            );
        }

        const section = await Section.findOne(course_id, section_order);
        if (!section) return errorResponse(res, "Section not found", 404);

        const lessons = await Lesson.findBySection(course_id, section_order);

        for (const lesson of lessons) {
            if (lesson.video_url) {
                try {
                    await deleteFromDrive(lesson.video_url);
                } catch (err) {
                    console.error(
                        `Failed to delete video for lesson ${lesson.lesson_order} from drive:`,
                        err,
                    );
                }
            }
        }

        const result = await Section.delete(course_id, section_order);
        if (result) {
            return successResponse(res, null, "Section deleted successfully");
        } else {
            return errorResponse(res, "Section not found", 404);
        }
    } catch (err) {
        next(err);
    }
};

export { createSection, getSectionsByCourseId, updateSection, deleteSection };
