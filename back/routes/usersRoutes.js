import express from 'express';
import { getUser, getUsers, createUser, updateUser, deleteUser } from '../controllers/usersController.js';
import { authOpaque } from '../middlewares/authOpaque.js';
import { requireRole } from '../middlewares/roleAuth.js';
import { requireOwnershipOrAdmin } from '../middlewares/ownershipAuth.js';

const router = express.Router();

router.post('/', createUser);
router.get('/:_id',authOpaque, getUser);
router.get('/',authOpaque, requireRole(['admin']), getUsers);
router.put('/:_id',authOpaque, requireOwnershipOrAdmin(), updateUser);
router.delete('/:_id',authOpaque,  requireRole(['admin']), deleteUser);

export default router;