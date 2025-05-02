import dotenv, { config } from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"


// authenticate user middleware
const authenticateUser = async (req, res, next) => {
    // const token = req.headers["authorization"];
    // if (!token) return res.status(404).json({ message: "no token found" });
  
    // jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
    //   if (err) return res.status(403).json({ message: "invalid token" });
    //   req.user = user;
    //   next();
    // });



  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
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