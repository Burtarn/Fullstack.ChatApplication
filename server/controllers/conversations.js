import pool from '../db.js';

export const getUserConversations = async (req, res) => {
    try {
    const userId = req.user.id; 
        const result = await pool.query(`
        SELECT c.* FROM conversations c
        JOIN conversation_participants p ON c.id = p.conversation_id
        WHERE p.user_id = $1
        `, [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Serverfel vid hämtning av konversationer' });
    }
};

export const createConversation = async (req, res) => {
    try {
        const { name, is_group, participants } = req.body;
        const result = await pool.query(
        `INSERT INTO conversations (name, is_group) VALUES ($1, $2) RETURNING *`,
        [name, is_group]
    );
    const conversationId = result.rows[0].id;

    const insertParticipants = participants.map(uid =>
        pool.query(
            `INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)`,
            [conversationId, uid]
        )
    );
    await Promise.all(insertParticipants);

    res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Misslyckades skapa konversation' });
    }
};

export const getConversationById = async (req, res) => {
    const id = req.params.id;
    const result = await pool.query('SELECT * FROM conversations WHERE id = $1', [id]);
    res.json(result.rows[0]);
};

export const addParticipant = async (req, res) => {
    try {
        const { user_id } = req.body;
        const conversationId = req.params.id;
        await pool.query(
        `INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [conversationId, user_id]
        );
        res.status(201).json({ message: 'Deltagare tillagd' });
    } catch (err) {
        res.status(500).json({ error: 'Misslyckades lägga till deltagare' });
    }
};
