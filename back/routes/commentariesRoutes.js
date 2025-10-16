import express from 'express';
import { getCommentary, getCommentaries, createCommentary, updateCommentary, deleteCommentary, getResponses } from '../controllers/commentariesController.js';
import { authOpaque } from '../middlewares/authOpaque.js';
import { requireOwnershipOrAdmin } from '../middlewares/ownershipAuth.js';

const router = express.Router();

router.get('/:id', getCommentary);
router.get('/responses/:parentId', getResponses);
router.get('/', getCommentaries);

router.post('/', authOpaque, createCommentary);
router.put('/:id',  authOpaque, requireOwnershipOrAdmin('userId'),updateCommentary);
router.delete('/:id',  authOpaque, requireOwnershipOrAdmin('userId'), deleteCommentary);

export default router;