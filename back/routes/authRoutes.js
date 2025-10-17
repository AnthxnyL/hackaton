import express from 'express';
import { signIn, signUp, signOut, me } from '../controllers/authController.js';
import { authOpaque } from '../middlewares/authOpaque.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.get('/me', authOpaque, me);

export default router;
