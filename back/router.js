import express from 'express';
import user from './routes/userRoutes';

const router = express.Router();

router.use('/users', user);

export default user;