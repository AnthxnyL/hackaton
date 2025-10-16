import express from 'express';
import users from './routes/usersRoutes.js';
import commentaries from './routes/commentariesRoutes.js';
import admin from './routes/adminRoutes.js'

const router = express.Router();

router.use('/users', users);
router.use('/commentaries', commentaries);
router.use('/admin', admin);

export default router;