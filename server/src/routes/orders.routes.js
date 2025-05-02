import express from "express";
import { placeOrder, getUserOrders, getOrderById } from "../controllers/orders.controllers.js"
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/placeorder", authenticateUser, placeOrder);
router.get("/getallorders", authenticateUser, getUserOrders); 
router.get("/getorder/:id", authenticateUser, getOrderById)

export default router;
