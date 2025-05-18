import express from "express";
import { addProduct, getAllProducts, getSingleProduct} from "../controllers/products.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { authenticateUser } from "../middleware/auth.middleware.js";


const router = express.Router()

router.post("/addproduct",authenticateUser,upload.single("image"), addProduct);
router.get("/getallproducts", getAllProducts);
router.get("/getsingleproduct/:id", getSingleProduct);


export default router;