import Joi from 'joi';

export const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
    });

    export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});