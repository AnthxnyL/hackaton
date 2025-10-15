import express from 'express';
import user from './routes/usersRoutes.js';

const router = express.Router();

router.use('/users', user);

export default user;