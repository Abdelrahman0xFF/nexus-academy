import Joi from "joi";

const enrollmentSchema = Joi.object({
    course_id: Joi.number().integer().required(),
    payment_method:
        Joi.string().valid("credit_card", "paypal", "bank_transfer") ??
        "credit_card",
});

export { enrollmentSchema };
