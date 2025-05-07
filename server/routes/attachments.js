import express from 'express';
import multer from 'multer';
import { uploadAttachment, getAttachment } from '../controllers/attachments.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/messages/:id/attachments', upload.single('file'), uploadAttachment);
router.get('/attachments/:id', getAttachment);

export default router;
