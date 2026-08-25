import express from 'express';
import {filterMediaByGenre, searchbyTitle} from "../controllers/media.controller.js";


const router = express.Router();

// routes
router.get('/genrefilter', filterMediaByGenre);
router.get('/q',searchbyTitle);

export default router;