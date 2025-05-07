import pool from '../db.js';
import path from 'path';

export const uploadAttachment = async (req, res) => {
    const messageId = req.params.id;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'Ingen fil skickades' });

    try {
        const result = await pool.query(
            `INSERT INTO attachments (message_id, file_url, file_type)
            VALUES ($1, $2, $3) RETURNING *`,
            [messageId, `/uploads/${file.filename}`, file.mimetype]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Misslyckades ladda upp fil' });
    }
};

export const getAttachment = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query(`SELECT * FROM attachments WHERE id = $1`, [id]);
        if (!result.rows.length) return res.status(404).json({ error: 'Fil ej hittad' });

        const filePath = path.join(__dirname, '..', result.rows[0].file_url);
        res.sendFile(filePath);
    } catch (err) {
        res.status(500).json({ error: 'Kunde inte hämta fil' });
    }
};
