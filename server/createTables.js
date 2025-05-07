import pool from './db.js';

const createTables = async () => {
    try {
        await pool.query(`
                    CREATE TABLE IF NOT EXISTS users (
                        id SERIAL PRIMARY KEY,
                        username VARCHAR(50) UNIQUE NOT NULL,
                        password TEXT NOT NULL
                    );

                    CREATE TABLE IF NOT EXISTS posts (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER REFERENCES users(id),
                        title VARCHAR(255) NOT NULL,
                        content TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS comments (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER REFERENCES users(id),
                        post_id INTEGER REFERENCES posts(id),
                        content TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS conversations (
                        id SERIAL PRIMARY KEY,
                        name TEXT,
                        is_group BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS conversation_participants (
                        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
                        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                        PRIMARY KEY (conversation_id, user_id)
                    );

                    CREATE TABLE IF NOT EXISTS messages (
                        id SERIAL PRIMARY KEY,
                        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
                        sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                        content TEXT,
                        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        is_edited BOOLEAN DEFAULT FALSE
                    );

                    CREATE TABLE IF NOT EXISTS message_read_status (
                        message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
                        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                        read_at TIMESTAMP,
                        PRIMARY KEY (message_id, user_id)
                    );

                    CREATE TABLE IF NOT EXISTS attachments (
                        id SERIAL PRIMARY KEY,
                        message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
                        file_url TEXT NOT NULL,
                        file_type TEXT,
                        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS message_reactions (
                        message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
                        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                        reaction TEXT NOT NULL,
                        reacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        PRIMARY KEY (message_id, user_id, reaction)
                    );
            `);

        console.log("Tabeller skapades (eller fanns redan)");
    } catch (err) {
        console.error("Fel vid tabellskapande", err);
    } finally {
        pool.end(); 
    }
    };

    createTables();