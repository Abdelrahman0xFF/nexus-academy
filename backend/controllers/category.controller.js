import Category from "../models/category.model.js";
import { categorySchema } from "../validators/category.validator.js";

const createCategory = async (req, res) => {
    try {
        const { error } = categorySchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = categorySchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        const result = await Category.update(id, req.body);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Category.delete(id);
        if (result) {
            res.json({ message: "Category deleted successfully" });
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getCoursesByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        const courses = await Category.findCoursesByCategoryId(id);
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
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
