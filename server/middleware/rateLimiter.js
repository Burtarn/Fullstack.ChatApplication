import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'För många förfrågningar, försök igen senare.',
});

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
    max: 5,
    message: 'För många inloggningsförsök, försök igen senare.',
});
