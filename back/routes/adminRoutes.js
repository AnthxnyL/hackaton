import express from 'express';
import { getNumberOfUsers, getNumberOfAdresses, newUsersThisMonth, totalComments, commentsPerDay } from "../controllers/adminController.js";
import { authOpaque } from '../middlewares/authOpaque.js';
import { requireRole } from '../middlewares/roleAuth.js';

const router = express.Router();

router.use(authOpaque);
router.use(requireRole(['admin']));

router.get('/numbers', getNumberOfUsers);
router.get('/adresses', getNumberOfAdresses);
router.get('/users-this-month', newUsersThisMonth);
router.get('/total-comments', totalComments);
router.get('/comments-per-day', commentsPerDay);

export default router;

