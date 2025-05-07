import express from 'express'
import {
    addReaction,
    removeReaction
} from '../controllers/reactions.js';

const router = express.Router();

router.post('/messages/:id/reactions', addReaction);
router.delete('/messages/:id/reactions', removeReaction);

export default router;
