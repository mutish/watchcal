// TODO: fetch data based on certain filters ie: genre, and release dates

import Media from "../models/media.model.js";

// filter based on genres
export const filterMediaByGenre = async (req, res) => {
    try {
        const { genres } = req.body;
        if (!genres) {
            return res.status(400).json({message:"That one that you're thinking, type it!"});
        }

        // convert to array
        const genreArray = genres.split(',').map(g => g.trim());
        const media = await Media.getMediaByGenre(genreArray);
        console.log("Fetch successful");
        res.status(200).json(media);
    } catch (error) {
        console.log("FAAH!! Something's not right: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

// fetch randomly for the homepage
export const homepageDisplay = async (req, res) => {
}

// fetch randomly but based on genres picked by the user
// params: genres, limit
export const displayMediaByUserGenres = async (req, res) => {
}

// filter by title
export const searchbyTitle = async (req, res) => {
    
}