import express from 'express';
import user from './routes/usersRoutes.js';
import auth from './routes/authRoutes.js';
import commentaries from './routes/commentariesRoutes.js';
import admin from './routes/adminRoutes.js'

const router = express.Router();

router.use('/users', user);
router.use('/auth', auth);
router.use('/commentaries', commentaries);
router.use('/admin', admin);

export default router;