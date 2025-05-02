import express from "express";
import { addProduct, getAllProducts, getSingleProduct, deleteProduct, editProduct, } from "../controllers/products.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
// import { authenticateUser } from "../middleware/auth.middleware.js";


const router = express.Router()

router.post("/addproduct",upload.single("image"), addProduct);
router.get("/getallproducts", getAllProducts);
router.get("/getsingleproduct/:id", getSingleProduct);
router.delete("/deleteproduct/:id", deleteProduct);
router.put("/editproduct/:id", editProduct);


export default router;