import express from 'express';
import {
    getUserConversations,
    createConversation,
    addParticipant,
    getConversationById
} from '../controllers/conversations.js';

const router = express.Router();

router.get('/', getUserConversations);
router.post('/', createConversation);
router.get('/:id', getConversationById);
router.post('/:id/participants', addParticipant);

export default router;
