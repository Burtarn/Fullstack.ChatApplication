import express from 'express';
import pool from '../db.js';
import authenticateJWT from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { postSchema } from '../validators/postValidator.js';


const router = express.Router();


/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Hämta alla inlägg
 *     description: Hämta alla inlägg med tillhörande kommentarer
 *     responses:
 *       200:
 *         description: En lista med alla inlägg
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   post_id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                   username:
 *                     type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         content:
 *                           type: string
 *                         created_at:
 *                           type: string
 *                         username:
 *                           type: string
 */
router.get('/', async (req, res) => {
    try {
        const postsResult = await pool.query(`
            SELECT 
                posts.id AS post_id,
                posts.title,
                posts.content,
                posts.created_at,
                users.username
            FROM posts
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC
        `);

        const posts = postsResult.rows;


        const commentsResult = await pool.query(`
            SELECT 
                comments.id,
                comments.content,
                comments.post_id,
                comments.created_at,
                users.username
            FROM comments
            JOIN users ON comments.user_id = users.id
            ORDER BY comments.created_at ASC
        `);

        const comments = commentsResult.rows;


        const postsWithComments = posts.map(post => ({
            ...post,
            comments: comments.filter(comment => comment.post_id === post.post_id)
        }));

        res.json(postsWithComments);
    } catch (err) {
        console.error('Fel vid hämtning av inlägg och kommentarer:', err);
        res.status(500).send('Serverfel');
    }
});


/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Skapa ett nytt inlägg
 *     description: Skapa ett nytt inlägg i bloggen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inlägget har skapats
 *       401:
 *         description: Inget JWT-token tillhandahölls
 *       500:
 *         description: Serverfel
 */
router.post('/', authenticateJWT, validate(postSchema), async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;

    try {
        await pool.query(
            'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3)',
            [userId, title, content]
        );
        res.status(201).json({ message: 'Inlägg skapat' });
    } catch (err) {
        console.error('Fel vid skapande av inlägg:', err);
        res.status(500).json({ error: 'Serverfel vid skapande av inlägg' });
    }
});

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Radera ett inlägg
 *     description: Raderar ett inlägg om det tillhör den inloggade användaren.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID på inlägget som ska tas bort
 *     responses:
 *       200:
 *         description: Inlägg raderat
 *       403:
 *         description: Du har inte behörighet att ta bort detta inlägg
 *       404:
 *         description: Inlägget hittades inte
 *       500:
 *         description: Serverfel
 */
router.delete('/:postId', authenticateJWT, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1 AND user_id = $2', [postId, userId]);
        if (rows.length === 0) {
            return res.status(403).json({ error: 'Du får inte ta bort detta inlägg' });
        }

        await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
        res.status(200).json({ message: 'Inlägg borttaget' });
    } catch (err) {
        console.error('Fel vid radering av inlägg:', err);
        res.status(500).json({ error: 'Serverfel' });
    }
});

export default router;
