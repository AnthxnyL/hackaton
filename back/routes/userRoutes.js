import express from 'express';
import { getUser, getUsers, createUser, updateUser, deleteUser } from '../controllers/usersController.js';

const router = express.Router();

router.get('/:id', getUser)
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;