// TODO: fetch data based on certain filters ie: genre, and release dates

import Media from "../models/media.model.js";

// filter based on genres
export const filterMediaByGenre = async (req, res) => {
    try {
        const { genres } = req.query;
        if (!genres) {
            return res.status(400).json({message:"That one that you're thinking, type it!"});
        }

        // convert to array
        const genreArray = genres.split(',').map(g => g.trim());
        const media = await Media.getMediaByGenre(genreArray);
        console.log(`User asked for: ${genres}`);
        res.status(200).json({
            media
        });
    } catch (error) {
        console.log("FAAH!! Something's not right: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

// fetch randomly for the homepage
export const homepageDisplay = async (req, res) => {
}
export const trendinglist = async (req, res) => {
    try {
        const trending = await Media.getTrendingMedia();
        res.status(200).json(trending);
    } catch (error) {
        console.log("Not cool: ",error.messgae);
        res.status(500).json({message:"Internal server error"});
    }
}

// fetch randomly but based on genres picked by the user
// params: genres, limit

// filter by title
export const searchbyTitle = async (req, res) => {
    try {
        const { title } = req.query;
        
        const result = await Media.filterMediaByTitle(title);
        if (result.length == 0) {
            return res.status(404).json({message: "Hmm that title doesnt exist"});
        }

        console.log(`fetched ${title}`);
        res.status(200).json({result});

    } catch (error) {
        console.log("you call yourself a developer,",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}