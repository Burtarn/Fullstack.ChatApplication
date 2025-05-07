import Joi from 'joi';

export const participantSchema = Joi.object({
    conversation_id: Joi.number().integer().required(),
    user_id: Joi.number().integer().required()
});