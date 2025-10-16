import express from 'express';
import { getNumberOfUsers, getNumberOfAdresses, newUsersThisMonth, totalComments, commentsPerDay } from "../controllers/adminController.js";

const router = express.Router();

router.get('/numbers', getNumberOfUsers);
router.get('/adresses', getNumberOfAdresses);
router.get('/users-this-month', newUsersThisMonth);
router.get('/total-comments', totalComments);
router.get('/comments-per-day', commentsPerDay);

export default router;

