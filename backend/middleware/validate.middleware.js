import { errorResponse } from "../utils/response.js";

export const validateRequest = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        return errorResponse(res, error.details[0].message, 400);
    }
    req.body = value;
    next();
};
