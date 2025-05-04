import dotenv, { config } from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"


// authenticate user middleware
const authenticateUser = async (req, res, next) => {
    
    
    try {
    const token = req.cookies.accessToken;
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
    // console.log(decoded);
    
    req.user = { id: decoded.id };
    next();
    
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
  // authenticate user middleware


  

  export  {authenticateUser}