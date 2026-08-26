// this middleware allows me to call any of the user's properties as long as they are authenticated
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if(!token){
            return res.status(401).json({message: "Unauthorised - No token provided"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({message:"Unauthorised -  Invalid token"});        
        }

        const user = await User.findOneById(decoded.usr_id);
        if(!user){
            return res.status(404).json({message:"User not found!"});
        }
        delete user.password;

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protect route", error.message);
        res.status(401).json({message: "Unauthorised - Invalid or expired token"})
    }
    
}

export default protectRoute;