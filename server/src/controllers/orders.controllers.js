import Product from "../models/products.models.js";
import Stripe from "stripe";
import Order from "../models/order.models.js";


const stripe = new Stripe(
  process.env.SECRET_KEY
);

const placeOrder = async (req, res) => {
  try {
    const { products } = req.body;
    console.log(products);

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    const productDetails = await Product.find({ _id: { $in: products } });

    if (productDetails.length !== products.length) {
      return res.status(400).json({ message: "Some products are invalid" });
    }

    const totalPrice = productDetails.reduce((sum, product) => sum + product.price, 0);

    const lineItems = productDetails.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:5173/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        // userId: req.user._id.toString(),
        products: JSON.stringify(products),
        totalPrice: totalPrice.toString(),
      },
    });

    res.status(200).json({
      message: "Checkout session created",
      id: session.id,
    });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Confirm Order: Creates order in database after successful payment
const confirmOrder = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // userId
    const { products, totalPrice } = session.metadata;
    const parsedProducts = JSON.parse(products);

    const order = await Order.create({
      // user: userId,
      products: parsedProducts,
      totalPrice: parseFloat(totalPrice),
    });

    // Populate user and product details
    const populatedOrder = await Order.findById(order._id)
      // .populate("user", "name email")
      .populate({
        path: "products",
        // populate: { path: "userId", select: "name email" },
      });

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export { placeOrder, confirmOrder }