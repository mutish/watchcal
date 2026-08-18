import jwt from "jsonwebtoken";

const generateTokenandSetCookie = (usr_id, res)=> {
    const token = jwt.sign({usr_id}, process.env.JWT_SECRET, {
        expiresIn:"15d"
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure:process.env.NODE_ENV
    });
};

export default generateTokenandSetCookie;