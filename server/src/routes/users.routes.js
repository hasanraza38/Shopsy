import express from "express";
import { 
    registerUser ,
    loginUser,
    logoutUser,
    refreshToken,
    getDashboardData,
} from "../controllers/users.controllers.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const router = express.Router()
// router.post("/registeruser",
//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1
//         }, 
//     ]),
//     registerUser
//     )

router.post("/registeruser", upload.single("avatar"),registerUser);
router.post("/loginuser", loginUser);
router.get("/logoutuser", logoutUser);
router.get("/getdashboard",authenticateUser,getDashboardData);
router.post("/refreshtoken", refreshToken);


export default router;