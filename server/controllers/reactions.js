import pool from '../db.js';

export const addReaction = async (req, res) => {
    const messageId = req.params.id;
    const userId = req.user.id;
    const { reaction } = req.body;

    try {
        await pool.query(
        `INSERT INTO message_reactions (message_id, user_id, reaction)
        VALUES ($1, $2, $3)
        ON CONFLICT (message_id, user_id, reaction) DO NOTHING`,
        [messageId, userId, reaction]
        );
        res.status(201).json({ message: 'Reaktion tillagd' });
    } catch (err) {
        res.status(500).json({ error: 'Kunde inte lägga till reaktion' });
    }
    };

export const removeReaction = async (req, res) => {
    const messageId = req.params.id;
    const userId = req.user.id;
    const { reaction } = req.body;

    try {
        await pool.query(
        `DELETE FROM message_reactions
        WHERE message_id = $1 AND user_id = $2 AND reaction = $3`,
        [messageId, userId, reaction]
        );
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Kunde inte ta bort reaktion' });
    }
};
