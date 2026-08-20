import express from 'express';
import {filterMediaByGenre} from "../controllers/media.controller.js";

const router = express.Router();

// routes
router.post('/genrefilter', filterMediaByGenre);

export default router;