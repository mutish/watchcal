import express from 'express';
import { fetchSchedule } from '../controllers/schedule.controller.js';
import protectRoute  from '../middleware/auth.middleware.js'

const router = express.Router();

router.get('/myschedule', protectRoute, fetchSchedule);


export default router;