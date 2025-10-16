import express from 'express';
import { getUser, getUsers, createUser, updateUser, deleteUser } from '../controllers/usersController.js';

const router = express.Router();

<<<<<<< HEAD
router.get('/:_id', getUser);
=======
router.get('/:_id', getUser)
>>>>>>> hashed-password
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);

export default router;