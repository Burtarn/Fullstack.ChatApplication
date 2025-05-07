import express from 'express';
import {
    getUserConversations,
    createConversation,
    addParticipant,
    getConversationById
} from '../controllers/conversations.js';
import validate from '../middleware/validate.js';
import { conversationSchema, participantSchema } from '../validators/conversationValidator.js';

const router = express.Router();

router.get('/', getUserConversations);
router.post('/', validate(conversationSchema), createConversation); // 
router.get('/:id', getConversationById);
router.post('/:id/participants', validate(participantSchema), addParticipant); 

export default router;
