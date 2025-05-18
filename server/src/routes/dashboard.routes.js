import express from "express";
import { deleteProduct, editProduct, getMyOrders,  getOrdersOnMyProduct,  getUserProducts } from "../controllers/dashboard.controllers.js";
import { authenticateUser } from "../middleware/auth.middleware.js";


const router = express.Router();

router.delete("/deleteproduct/:productId", authenticateUser,deleteProduct);
router.put("/editproduct/:productId", authenticateUser, editProduct);
router.get("/myorders", authenticateUser, getMyOrders);
router.get("/orders", authenticateUser, getOrdersOnMyProduct);
router.get("/products", authenticateUser, getUserProducts);

export default router;