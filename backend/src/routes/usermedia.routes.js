import express from 'express';
import { displayFavorites, addFavorite } from "../controllers/usermedia.controller.js";

const router = express.Router();

router.get('/myfavorites', displayFavorites);
router.post('/add-favorites', addFavorite);