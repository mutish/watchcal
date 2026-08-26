import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateTokenandSetCookie from "../utils/generateToken.js"; // Remove unused import


export const signup = async (req, res) => {
    try {
        const {fullname, username, email, password, confirmPassword, gender} = req.body;

        // password validation
        if(password !== confirmPassword){
            return res.status(400).json({
                error: "Your passwords dont seem to agree with each other. Please try again."
            });
        }
        const user = await User.findOneByUsername(username) 
        if (user) {
            return res.status(400).json({error: "Username already exists"});
        } 

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, salt);

        //pfp https://avatar.iran.liara.run/public/boy
        const ProfilePic = `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=128`;
        //const femaleProfilePic= `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = await User.create({
            fullname,
            username,
            email,
            password: hashed_password,
            gender,
            pfp_url: ProfilePic   
        })

        if (newUser){
            generateTokenandSetCookie(newUser.usr_id, res);
           

            console.log("New user created successfully:)");
            res.status(201).json({
                // pass what to be displayed on postman
                id: newUser.usr_id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                gender: newUser.gender,
                profile: newUser.pfp_url,
            });
        } else {
            console.log("Worry not its not you, its the user!");
            res.status(400).json({error: "We failed to create you, check your details"});
        }

    } catch(error) {
        console.log("Error in signup controller, that's on you", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOneByUsername(username);
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');

        if(!user || !isPasswordCorrect){
            return res.status(400).json({message:"Invalid username or password"});
        }

        generateTokenandSetCookie(user.usr_id,res);

        console.log("User login successfully");
        res.status(200).json({
            username: user.username,
            profile: user.pfp_url
        })
    } catch (error) {
        console.error("Your bad :| ->", error.message);
        res.status(500).json({message:"Internal server error"})
    }

}

export const updateProfile = async (req, res) => {
    try {
        const {currentUsername, newUsername} = req.body;
        
        const currentUser = await User.findOneByUsername(currentUsername);
        if(!currentUser){
            console.log("This bro doesnt even exist");
            return res.status(404).json({message:"You dont exist, please signup"});
        }
        
        const newPfp = `https://ui-avatars.com/api/?name=${newUsername}`;
        // Pass the user ID as the first argument
        const updatedUser = await User.updateProfile(currentUser.usr_id, newUsername, newPfp);
        if (updatedUser) {
            res.status(200).json({message: "Success, new name new you! Hihi"});
        } else {
            res.status(400).json({error: "Bruh :| its not that hard"});
        }
    } catch (error) {
        console.log("Error in updateProfile controller, shame upon thou :| ->",error.message);
        res.status(500).json({error: "Failed to update profile, internal server error"});
    }
}

export const logout = (req, res) => {
    try {
        
        res.cookie("jwt","",{maxAge:0})
        console.log("User logged out successfully");
        res.status(200).json({message:"Log out successfully"});

    } catch (error) {
        console.log("User failed to log out: ", error.message);
        res.status(500).json({message:"Internal server error"});
        
    }
}