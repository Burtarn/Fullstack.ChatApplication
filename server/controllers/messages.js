import pool from '../db.js';

export const getMessages = async (req, res) => {
    const conversationId = req.params.id;
    try {
        const result = await pool.query(
        `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY sent_at ASC`,
        [conversationId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Kunde inte hämta meddelanden' });
    }
};

export const sendMessage = async (req, res) => {
    const conversationId = req.params.id;
    const senderId = req.user.id;
    const { content } = req.body;

    try {
        const result = await pool.query(
        `INSERT INTO messages (conversation_id, sender_id, content)
        VALUES ($1, $2, $3) RETURNING *`,
        [conversationId, senderId, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Kunde inte skicka meddelande' });
    }
};

export const updateMessage = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const result = await pool.query(
        `UPDATE messages SET content = $1, is_edited = TRUE WHERE id = $2 RETURNING *`,
        [content, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Kunde inte uppdatera meddelande' });
    }
};

export const deleteMessage = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(`DELETE FROM messages WHERE id = $1`, [id]);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Kunde inte ta bort meddelande' });
    }
};
