import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import postsRouter from './routes/posts.js';       // ✅ Lägg till denna rad
import commentRouter from './routes/comments.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import { logger, httpLogger } from './utils/Logger.js';
import { swaggerUi, swaggerDocument } from './utils/swagger.js';
import { generalLimiter, loginLimiter } from './middleware/rateLimiter.js';
import pool from './db.js'; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

console.log("Testar databasanslutning...");
console.log(pool); 

// Middleware
app.use(generalLimiter);
app.use(cors());
app.use(express.json());
app.use(httpLogger);

// Routes
app.use('/api/auth', authRoutes, loginLimiter); // auth först
app.use('/posts', postsRouter);
app.use('/comments', commentRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handler
app.use(errorMiddleware);

// Server start
app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});
