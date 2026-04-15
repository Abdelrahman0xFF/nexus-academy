import Joi from "joi";

const lessonSchema = Joi.object({
    course_id: Joi.number().integer().required(),
    section_order: Joi.number().integer().required(),
    lesson_order: Joi.number().integer().required(),
    title: Joi.string().max(255).required(),
    description: Joi.string().allow(""),
});

const updateLessonSchema = Joi.object({
    title: Joi.string().max(255),
    description: Joi.string().allow(""),
});

export { lessonSchema, updateLessonSchema };
