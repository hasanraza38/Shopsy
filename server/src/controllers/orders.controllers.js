import Order from "../models/order.models.js";
import Product from "../models/products.models.js";

const placeOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    const productDetails = await Product.find({ _id: { $in: products } });

    if (productDetails.length !== products.length) {
      return res.status(400).json({ message: "Some products are invalid" });
    }

    const totalPrice = productDetails.reduce((sum, product) => sum + product.price, 0);


    const order = await Order.create({
      user: req.user._id,
      products,
      totalPrice
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("products");

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};





const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("products")
      .populate("user", "username email"); 

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export {placeOrder , getUserOrders, getOrderById}