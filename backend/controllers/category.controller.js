import Category from "../models/category.model.js";
import Course from "../models/course.model.js";
import { categorySchema } from "../validators/category.validator.js";
import { successResponse, errorResponse } from "../utils/response.js";

const createCategory = async (req, res, next) => {
    try {
        const { error } = categorySchema.validate(req.body);
        if (error)
            return errorResponse(res, error.details[0].message, 400);

        const newCategory = await Category.create(req.body);
        return successResponse(res, newCategory, "Category created successfully", 201);
    } catch (err) {
        next(err);
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const category = await Category.findById(category_id);
        if (category) {
            return successResponse(res, category);
        } else {
            return errorResponse(res, "Category not found", 404);
        }
    } catch (err) {
        next(err);
    }
};

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        return successResponse(res, categories);
    } catch (err) {
        next(err);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const { error } = categorySchema.validate(req.body);
        if (error)
            return errorResponse(res, error.details[0].message, 400);

        const result = await Category.update(category_id, req.body);
        if (result) {
            return successResponse(res, result, "Category updated successfully");
        } else {
            return errorResponse(res, "Category not found", 404);
        }
    } catch (err) {
        next(err);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const result = await Category.delete(category_id);
        if (result) {
            return successResponse(res, null, "Category deleted successfully");
        } else {
            return errorResponse(res, "Category not found", 404);
        }
    } catch (err) {
        next(err);
    }
};

const getCoursesByCategory = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user?.user_id || null;
        const isAdmin = req.user?.role === "admin";

        const category = await Category.findById(category_id);
        if (!category) {
            return errorResponse(res, "Category not found", 404);
        }
        const courses = await Course.findByCategoryId(
            category_id,
            Number(page),
            Number(limit),
            userId,
            isAdmin,
        );
        return successResponse(res, courses);
    } catch (err) {
        next(err);
    }
};

export {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCoursesByCategory,
};
