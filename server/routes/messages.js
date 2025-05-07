import express from 'express';
import {
    getMessages,
    sendMessage,
    updateMessage,
    deleteMessage
} from '../controllers/messages.js';

const router = express.Router();

router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);
router.patch('/messages/:id', updateMessage);
router.delete('/messages/:id', deleteMessage);

export default router;
