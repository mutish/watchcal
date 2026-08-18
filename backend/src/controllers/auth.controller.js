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
        const maleProfilePic = `https://avatar.iran.liara.run/public/boy?usearname=${username}`
        const femaleProfilePic= `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = await User.create({
            fullname,
            username,
            email,
            pass_hash: hashed_password,
            gender,
            pfp_url: gender === "male" ? maleProfilePic : femaleProfilePic
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

export const login = (req, res) => {
    console.log('login says hi');
}

export const logout = (req, res) => {
    console.log('logout says bye');
}