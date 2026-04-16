import Joi from "joi";

const courseSchema = Joi.object({
    category_id: Joi.number().integer().required(),
    title: Joi.string().max(255).required(),
    description: Joi.string().required(),
    price: Joi.number().precision(2).allow(null),
    original_price: Joi.number().precision(2).required(),
    level: Joi.string().valid("Beginner", "Intermediate", "Advanced").required(),
    is_available: Joi.boolean(),
});

const updateCourseSchema = Joi.object({
    category_id: Joi.number().integer(),
    title: Joi.string().max(255),
    description: Joi.string(),
    price: Joi.number().precision(2).allow(null),
    original_price: Joi.number().precision(2),
    thumbnail_url: Joi.string().uri(),
    level: Joi.string().valid("Beginner", "Intermediate", "Advanced"),
    is_available: Joi.boolean(),
});

export { courseSchema, updateCourseSchema };
