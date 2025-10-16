import express from 'express';
import { getCommentary, getCommentaries, createCommentary, updateCommentary, deleteCommentary, getResponses } from '../controllers/commentariesController.js';

const router = express.Router();

router.get('/:id', getCommentary);
router.get('/responses/:parentId', getResponses);
router.get('/', getCommentaries);
router.post('/', createCommentary);
router.put('/:id', updateCommentary);
router.delete('/:id', deleteCommentary);

export default router;