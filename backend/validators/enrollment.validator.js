import Joi from "joi";

const enrollmentSchema = Joi.object({
    course_id: Joi.number().integer().required(),
    payment_method: Joi.string()
        .optional()
        .valid("card", "paypal", "bank_transfer"),
    payment_status: Joi.string().optional().valid("paid", "pending", "failed"),
});

export { enrollmentSchema };
