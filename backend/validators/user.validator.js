import Joi from "joi";

const registerSchema = Joi.object({
    first_name: Joi.string().required().max(50),
    last_name: Joi.string().required().max(50),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Confirm password must match password",
        }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().min(6).required(),
    confirm_password: Joi.string()
        .valid(Joi.ref("new_password"))
        .required()
        .messages({
            "any.only": "Confirm password must match new password",
        }),
});

const updateUserSchema = Joi.object({
    first_name: Joi.string().max(50),
    last_name: Joi.string().max(50),
    title: Joi.string().max(100),
    bio: Joi.string().max(500),
    avatar_url: Joi.string().uri().allow(null, ""),
    role: Joi.string().valid("user", "instructor", "admin"),
});

export { registerSchema, loginSchema, changePasswordSchema, updateUserSchema };
