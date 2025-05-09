import pool from '../db.js';

const createIndexes = async () => {
    try {
        await pool.query(`
        -- Index för posts
        CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);

        -- Index för comments
        CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
        CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

        -- Index för conversation_participants
        CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);

        -- Index för messages
        CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
        CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

        -- Index för message_read_status
        CREATE INDEX IF NOT EXISTS idx_message_read_status_user_id ON message_read_status(user_id);

        -- Index för attachments
        CREATE INDEX IF NOT EXISTS idx_attachments_message_id ON attachments(message_id);

        -- Index för message_reactions
        CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id ON message_reactions(user_id);
        `);

        console.log("Index skapades (eller fanns redan)");
    } catch (err) {
        console.error("Fel vid indexskapande", err);
    } finally {
        pool.end();
    }
};

createIndexes();
