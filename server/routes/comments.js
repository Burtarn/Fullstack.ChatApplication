import express from 'express';
import pool from '../db.js';
import authenticateJWT from '../middleware/authMiddleware.js';

const router = express.Router();



/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Hämta alla kommentarer
 *     description: Returnerar en lista med alla kommentarer, inklusive användarnamn och tillhörande post-id.
 *     responses:
 *       200:
 *         description: En lista med kommentarer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   post_id:
 *                     type: integer
 *                     example: 3
 *                   user_id:
 *                     type: integer
 *                     example: 2
 *                   username:
 *                     type: string
 *                     example: robin123
 *                   content:
 *                     type: string
 *                     example: Bra skrivet!
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                comments.id,
                comments.post_id,
                comments.user_id,
                users.username,
                comments.content,
                comments.created_at
            FROM comments
            JOIN users ON comments.user_id = users.id
            ORDER BY comments.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Fel vid hämtning av kommentarer:', err);
        res.status(500).json({ error: 'Serverfel' });
    }
});

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Skapa en kommentar
 *     description: Lägger till en kommentar till ett specifikt inlägg. Kräver JWT-autentisering.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - content
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: Detta är en kommentar
 *     responses:
 *       201:
 *         description: Kommentaren sparades
 *       401:
 *         description: Obehörig – token saknas eller är ogiltig
 *       500:
 *         description: Serverfel
 */
router.post('/', authenticateJWT, async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.user.id;

    try {
        await pool.query(
        'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3)',
        [userId, postId, content]
        );
        res.status(201).send('Kommentar sparad');
    } catch (err) {
        console.error('Fel vid sparning av kommentar:', err);
        res.status(500).json({ error: 'Serverfel' });
    }
});

/**
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Hämta kommentarer för ett specifikt inlägg
 *     description: Returnerar alla kommentarer som tillhör ett specifikt inlägg.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID på det inlägg som kommentarerna tillhör
 *     responses:
 *       200:
 *         description: En lista med kommentarer för inlägget
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 2
 *                   username:
 *                     type: string
 *                     example: "emma42"
 *                   content:
 *                     type: string
 *                     example: "Intressant läsning!"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Serverfel
 */
router.get('/post/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const result = await pool.query(`
            SELECT 
                comments.id,
                comments.user_id,
                users.username,
                comments.content,
                comments.created_at
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = $1
            ORDER BY comments.created_at ASC
        `, [postId]);

        res.json(result.rows);
    } catch (err) {
        console.error('Fel vid hämtning av kommentarer för post:', err);
        res.status(500).json({ error: 'Serverfel' });
    }
});

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Radera en kommentar
 *     description: Raderar en kommentar som tillhör den inloggade användaren.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID på kommentaren som ska tas bort
 *     responses:
 *       200:
 *         description: Kommentar raderad
 *       403:
 *         description: Du får inte ta bort denna kommentar
 *       404:
 *         description: Kommentaren hittades inte
 *       500:
 *         description: Serverfel
 */
router.delete('/:commentId', authenticateJWT, async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
        const { rows } = await pool.query(
            'SELECT * FROM comments WHERE id = $1 AND user_id = $2',
            [commentId, userId]
        );

        if (rows.length === 0) {
            return res.status(403).json({ error: 'Du får inte ta bort denna kommentar' });
        }

        await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
        res.status(200).json({ message: 'Kommentar raderad' });
    } catch (err) {
        console.error('Fel vid radering av kommentar:', err);
        res.status(500).json({ error: 'Serverfel' });
    }
});

export default router;
