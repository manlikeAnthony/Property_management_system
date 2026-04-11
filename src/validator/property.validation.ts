import Joi from "joi";

export const createPropertySchema = Joi.object({
    title: Joi.string().trim().max(100).required().messages({
        "string.empty": "Title cannot be empty",
        "string.max": "Title cannot exceed 100 characters",
        "any.required": "Title is required",
    }),
    description: Joi.string().max(1000).messages({
        "string.max": "Description cannot exceed 1000 characters",
    }),
    price: Joi.number().positive().required().messages({
        "number.base": "Price must be a number",
        "number.positive": "Price must be a positive number",
        "any.required": "Price is required",
    }),
    type: Joi.string().valid("RENT", "SALE").required().messages({
        "any.only": "Type must be either 'RENT' or 'SALE'",
        "any.required": "Type is required",
    }),
    address : Joi.object({
        street: Joi.string().trim().max(100).required().messages({
            "string.empty": "Street cannot be empty",
            "string.max": "Street cannot exceed 100 characters",
            "any.required": "Street is required",
        }),
        city: Joi.string().trim().max(50).required().messages({
            "string.empty": "City cannot be empty",
            "string.max": "City cannot exceed 50 characters",
            "any.required": "City is required",
        }),
        state: Joi.string().trim().max(50).required().messages({
            "string.empty": "State cannot be empty",
            "string.max": "State cannot exceed 50 characters",
            "any.required": "State is required",
        }),
        country: Joi.string().trim().max(50).default("Nigeria").messages({
            "string.max": "Country cannot exceed 50 characters",
        }),
    }).required().messages({
        "any.required": "Address is required",
    }),
    bedrooms: Joi.number().integer().min(0).messages({
        "number.base": "Bedrooms must be a number",
        "number.integer": "Bedrooms must be an integer",
        "number.min": "Bedrooms cannot be negative",
    }),
    bathrooms: Joi.number().integer().min(0).messages({
        "number.base": "Bathrooms must be a number",
        "number.integer": "Bathrooms must be an integer",
        "number.min": "Bathrooms cannot be negative",
    }),
    area: Joi.number().positive().messages({
        "number.base": "Area must be a number",
        "number.positive": "Area must be a positive number",
    }),
    
});

export const updatePropertySchema = Joi.object({
    title: Joi.string().trim().max(100).messages({
        "string.empty": "Title cannot be empty",
        "string.max": "Title cannot exceed 100 characters",
    }),
    description: Joi.string().max(1000).messages({
        "string.max": "Description cannot exceed 1000 characters",
    }),
    price: Joi.number().positive().messages({
        "number.base": "Price must be a number",
        "number.positive": "Price must be a positive number",
    }),
    type: Joi.string().valid("RENT", "SALE").messages({
        "any.only": "Type must be either 'RENT' or 'SALE'",
    }),
    address : Joi.object({
        street: Joi.string().trim().max(100).messages({
            "string.empty": "Street cannot be empty",
            "string.max": "Street cannot exceed 100 characters",
        }),
        city: Joi.string().trim().max(50).messages({
            "string.empty": "City cannot be empty",
            "string.max": "City cannot exceed 50 characters",
        }),
        state: Joi.string().trim().max(50).messages({
            "string.empty": "State cannot be empty",
            "string.max": "State cannot exceed 50 characters",
        }),
        country: Joi.string().trim().max(50).messages({
            "string.max": "Country cannot exceed 50 characters",
        }),
    }),
    bedrooms: Joi.number().integer().min(0).messages({
        "number.base": "Bedrooms must be a number",
        "number.integer": "Bedrooms must be an integer",
        "number.min": "Bedrooms cannot be negative",
    }),
    bathrooms: Joi.number().integer().min(0).messages({
        "number.base": "Bathrooms must be a number",
        "number.integer": "Bathrooms must be an integer",
        "number.min": "Bathrooms cannot be negative",
    }),
    area: Joi.number().positive().messages({
        "number.base": "Area must be a number",
        "number.positive": "Area must be a positive number",
    }),
});

const getAllPropertiesByTypeSchema = Joi.object({
    type: Joi.string().valid("RENT", "SALE").required().messages({
        "any.only": "Type must be either 'RENT' or 'SALE'",
        "any.required": "Type query parameter is required",
    }),
});