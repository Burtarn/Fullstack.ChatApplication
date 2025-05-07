import express from 'express';
import {
    getMessages,
    sendMessage,
    updateMessage,
    deleteMessage
} from '../controllers/messages.js';
import validate from '../middleware/validate.js';
import { messageSchema } from '../validators/messageValidator.js';

const router = express.Router();

router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', validate(messageSchema), sendMessage);
router.patch('/messages/:id', validate(messageSchema), updateMessage);
router.delete('/messages/:id', deleteMessage);

export default router;
