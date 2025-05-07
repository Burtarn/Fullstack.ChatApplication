import Joi from 'joi';

export const postSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    title: Joi.string().max(255).required(),
    content: Joi.string().required()
});
