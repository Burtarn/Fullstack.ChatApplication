import Joi from 'joi';

export const commentSchema = Joi.object({
    postId: Joi.number().integer().required().description('ID på inlägget kommentaren tillhör'),
    content: Joi.string().min(1).max(1000).required().description('Innehållet i kommentaren'),
    });

    export const commentDeleteSchema = Joi.object({
    commentId: Joi.number().integer().required().description('ID på kommentaren som ska tas bort'),
});
