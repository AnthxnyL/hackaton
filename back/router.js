import express from 'express';
<<<<<<< HEAD
import users from './routes/usersRoutes.js';
=======
import user from './routes/usersRoutes.js';
import auth from './routes/authRoutes.js';
>>>>>>> hashed-password
import commentaries from './routes/commentariesRoutes.js';

const router = express.Router();

<<<<<<< HEAD
router.use('/users', users);
=======
router.use('/users', user);
router.use('/auth', auth);
>>>>>>> hashed-password
router.use('/commentaries', commentaries);

export default router;