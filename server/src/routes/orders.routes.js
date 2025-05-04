import express from "express";
import { placeOrder, confirmOrder } from "../controllers/orders.controllers.js"
// import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/placeorder", placeOrder);
router.get("/confirm", confirmOrder);



export default router;
