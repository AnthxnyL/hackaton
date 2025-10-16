import express from 'express';
import { getNumberOfUsers, getNumberOfAdresses } from "../controllers/adminController.js";

const router = express.Router();

router.get('/numbers', getNumberOfUsers);
router.get('/adresses', getNumberOfAdresses);

export default router;

