import Joi from 'joi';

export const messageSchema = Joi.object({
    conversation_id: Joi.number().integer().required(),
    sender_id: Joi.number().integer().required(),
    content: Joi.string().required()
});
