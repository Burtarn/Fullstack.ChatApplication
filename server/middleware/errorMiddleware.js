import dotenv from 'dotenv';
dotenv.config();

export default (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV !== 'production') {
        console.error('[ERROR]', err);
    } else {

        console.error(`[${new Date().toISOString()}] ${err.message}`);
    }


    const response = {
        message: err.message || 'Internal Server Error',
    };


    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
        response.details = err.details || null;
    }

    res.status(statusCode).json(response);
};
