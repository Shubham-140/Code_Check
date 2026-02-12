import jwt from "jsonwebtoken";

const generateJWT=(userId, role)=>{
    try {
        const userDetails={userId, role};
        return jwt.sign(userDetails, process.env.JWT_SECRET, {expiresIn:"2d"});
    } catch (error) {
        throw new Error("Unable to generate JWT at the moment.");
    }
}

const verifyJWT=(req, res, next)=>{
    try {
        const authHeader=req.headers?.authorization;

        if(!authHeader.startsWith("Bearer ")){
            return res.status(401).json({error:"Token format invalid"})
        }

        const token=authHeader?.split(" ")[1];

        if(!token){
            return res.status(401).json({error:"Token is missing"});
        }

        const decodedData=jwt.verify(token, process.env.JWT_SECRET);
        req.user=decodedData;
        next();
    } catch (error) {
        res.status(401).json({error:"Invalid token"});
    }
}

export {generateJWT, verifyJWT};