import express from "express";
import { 
    registerUser ,
    loginUser,
    logoutUser,
    refreshToken,
} from "../controllers/auth.controllers.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
// import { upload } from "../middleware/multer.middleware.js";


const router = express.Router()


router.post("/registeruser", registerUser);
router.post("/loginuser", loginUser);
router.get("/logout", logoutUser);
router.post("/refreshtoken", refreshToken);


export default router;