import express from 'express';
import users from './routes/usersRoutes.js';
import commentaries from './routes/commentariesRoutes.js';

const router = express.Router();

router.use('/users', users);
router.use('/commentaries', commentaries);

export default router;