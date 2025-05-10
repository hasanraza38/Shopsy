import express from "express";
import { 
    registerUser ,
    loginUser,
    logoutUser,
    refreshToken,
    authorizeUser,
    uploadImage,
} from "../controllers/auth.controllers.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const router = express.Router()


router.post("/registeruser", upload.single("avatar"),registerUser);
router.post("/loginuser", loginUser);
router.get("/logout", logoutUser);
router.post("/refreshtoken", refreshToken);
router.get('/authorizeuser',authenticateUser, authorizeUser);
router.post("/uploadimage", upload.single("image"), uploadImage);



export default router;