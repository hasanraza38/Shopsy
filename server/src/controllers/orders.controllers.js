import Product from "../models/products.models.js";
import Stripe from "stripe";
import Order from "../models/order.models.js";
import Users from "../models/auth.models.js";
import Products from "../models/products.models.js";


const stripe = new Stripe(
  process.env.SECRET_KEY
);

const placeOrder = async (req, res) => {
  try {
    const { products } = req.body;
    // console.log(products);

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
      success_url: `https://shopsy1.vercel.app/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "https://shopsy1.vercel.app/cancel",
      metadata: {
        userId: req.user.id.toString(),
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

    const { products, totalPrice ,userId} = session.metadata;
    const parsedProducts = JSON.parse(products);

    const order = await Order.create({
      userId,
      products: parsedProducts,
      totalPrice: parseFloat(totalPrice),
    });
    await Users.updateOne({ _id: userId }, { $push: { orders: order._id } });
    
    await Products.updateMany(
      { _id: { $in: parsedProducts } },
      { $push: { orders: order._id } }
    );

    
    
    
    const populatedOrder = await Order.findById(order._id)
    .populate("userId", "email username")
    .populate({
      path: "products",
      populate: { path: "userId", select: "email username" },
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