// router.delete("/deleteproduct/:id",authenticateUser, deleteProduct);
// router.put("/editproduct/:id",authenticateUser, editProduct);

import express from "express";
import { deleteProduct, editProduct, getOrderedProducts, getUserOrders } from "../controllers/dashboard.controllers.js";
import { authenticateUser } from "../middleware/auth.middleware.js";


const router = express.Router();

router.delete("/deleteproduct/:productId", authenticateUser,deleteProduct);
router.put("/editproduct/:productId", authenticateUser, editProduct);
router.get("/orders", authenticateUser, getUserOrders);
router.get("/ordered-products", authenticateUser, getOrderedProducts);

export default router;