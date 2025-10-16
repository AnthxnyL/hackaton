import express from 'express';
import user from './routes/userRoutes.js';
import auth from './routes/authRoutes.js';
import commentaries from './routes/commentariesRoutes.js';

const router = express.Router();

router.use('/users', user);
router.use('/auth', auth);
router.use('/commentaries', commentaries);

export default router;