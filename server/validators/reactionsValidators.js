import Joi from 'joi';

export const reactionSchema = Joi.object({
    message_id: Joi.number().integer().required(),
    user_id: Joi.number().integer().required(),
    reaction_type: Joi.string().valid('like', 'love', 'laugh', 'angry', 'sad').required()
});
