import express from 'express';
import { register, login } from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import validate from '../middleware/validate.js';
import { authenticateJWT } from '../middleware/authMiddleware.js'; // För JWT-skyddade rutter

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrera en ny användare
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Användare skapad
 *       400:
 *         description: Ogiltig data
 *       500:
 *         description: Serverfel
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Logga in användare
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inloggning lyckades
 *       400:
 *         description: Ogiltig data
 *       401:
 *         description: Ogiltiga inloggningsuppgifter
 *       500:
 *         description: Serverfel
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/protected:
 *   get:
 *     summary: En skyddad route som kräver en giltig JWT-token
 *     security:
 *       - bearerAuth: []  # Använd JWT via Authorization header
 *     responses:
 *       200:
 *         description: Skyddad resurs hämtad
 *       401:
 *         description: Otillåten åtkomst - Token saknas eller är ogiltig
 *       500:
 *         description: Serverfel
 */
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'Detta är en skyddad resurs' });
});

export default router;
