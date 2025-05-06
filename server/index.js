import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import { logger, httpLogger } from './utils/Logger.js';
import { swaggerUi, swaggerDocument } from './utils/swagger.js';
import { generalLimiter, loginLimiter } from './middleware/rateLimiter.js';
import pool from './db.js'; // Importera databasanslutningen

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

console.log("Testar databasanslutning...");
console.log(pool); // Logga pool-objektet

app.use(generalLimiter);
app.use(cors());
app.use(express.json());
app.use(httpLogger);


app.use('/api/auth', authRoutes, loginLimiter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorMiddleware);


app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});