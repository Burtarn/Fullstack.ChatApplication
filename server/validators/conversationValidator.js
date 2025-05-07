import Joi from 'joi';

export const conversationSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().optional().max(1000),
    });

    export const participantSchema = Joi.object({
    userId: Joi.number().integer().required(),
});
