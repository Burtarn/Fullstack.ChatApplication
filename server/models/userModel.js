import pool from '../db.js';

export const createUser = async (username, hashedPassword) => {
    try {

        if (!username || !hashedPassword) {
            throw new Error('Användarnamn och lösenord krävs.');
        }

        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );

        if (result.rows.length === 0) {
            throw new Error('Kunde inte skapa användare.'); 
        }

        return result.rows[0];
    } catch (error) {
        console.error('Fel vid skapande av användare:', error);
        throw new Error(`Kunde inte skapa användare: ${error.message}`);
    }
};