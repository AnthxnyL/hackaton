import express from 'express';
import { getUser, createUser, updateUser, deleteUser } from '../controllers/usersController';

const router = express.Router();

router.get('/:id', getUser)
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
