import dotenv from 'dotenv';
dotenv.config();

export default (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Logga hela error-objektet i utvecklingsmiljö
    if (process.env.NODE_ENV !== 'production') {
        console.error('[ERROR]', err);
    } else {
        // I produktion, logga endast stacktrace om du har en loggtjänst
        console.error(`[${new Date().toISOString()}] ${err.message}`);
    }

    // Förbered säkert svar
    const response = {
        message: err.message || 'Internal Server Error',
    };

    // Visa mer info i utvecklingsmiljö
    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
        response.details = err.details || null;
    }

    res.status(statusCode).json(response);
};
