import usrMedia from "../models/usermedia.model.js";

export const addFavorite = async (req, res) => {
    try {
        const { value } = req.body;
        if(value == "false" || value == "true"){
            return res.status(404).json({message:"Use either true or false"});
        }
        const result = await usrMedia.addFavorite(value);
        //result = await usrMedia.displayFavorites();
        displayFavorites();
        console.log("Favorite list updated successfully");
        res.status(200).json({result});

        //call the sql that displays the new updated favorite list
    } catch (error) {
        console.log("Sigh!! I cant no more,",error.message);
        res.status(500).json({message:"Sorry, try again later :("});
    }
}

export const displayFavorites = async (req, res) => {
    try {
        const result = await usrMedia.displayFavorites();
        res.status(200).json({result});
    } catch (error) {
        console.log("Error occurred while fetching favorites:", error.message);
        res.status(500).json({message:"Sorry, try again later :("});
    }
}