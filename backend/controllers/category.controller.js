import Category from "../models/category.model.js";
import Course from "../models/course.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import asyncHandler from "../utils/asyncHandler.js";

const createCategory = asyncHandler(async (req, res, next) => {
    const newCategory = await Category.create(req.body);
    return successResponse(
        res,
        newCategory,
        "Category created successfully",
        201,
    );
});

const getCategoryById = asyncHandler(async (req, res, next) => {
    const { category_id } = req.params;
    const category = await Category.findById(category_id);
    if (category) {
        return successResponse(res, category);
    } else {
        return errorResponse(res, "Category not found", 404);
    }
});

const getAllCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.findAll();
    return successResponse(res, categories);
});

const updateCategory = asyncHandler(async (req, res, next) => {
    const { category_id } = req.params;

    const result = await Category.update(category_id, req.body);
    if (result) {
        return successResponse(res, result, "Category updated successfully");
    } else {
        return errorResponse(res, "Category not found", 404);
    }
});

const deleteCategory = asyncHandler(async (req, res, next) => {
    const { category_id } = req.params;
    const result = await Category.delete(category_id);
    if (result) {
        return successResponse(res, null, "Category deleted successfully");
    } else {
        return errorResponse(res, "Category not found", 404);
    }
});

const getCoursesByCategory = asyncHandler(async (req, res, next) => {
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
});

export {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCoursesByCategory,
};
