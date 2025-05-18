import Product from "../models/products.models.js";
import Order from "../models/order.models.js";
import mongoose from "mongoose";
import Users from "../models/auth.models.js";
  


const getUserProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId)
      .populate({
        path: "products",
        populate: { path: "userId", select: "username email" },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User products fetched successfully",
      products: user.products || [],
    });
  } catch (error) {
    console.error("Error fetching user products:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



const deleteProduct = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId =  req.user.id;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Not valid Id" });
      }

      const product = await Product.findOne({ _id: productId, userId  });
      
      if (!product) {
        return res.status(404).json({ message: "Product not found or not authorized" });
      }
  
      await Product.deleteOne({ _id: productId });
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  


const editProduct = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId =  req.user.id;
      const { name, description, price } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Not valid Id" });
      }

      const product = await Product.findOne({ _id: productId, userId});
      if (!product) {
        return res.status(404).json({ message: "Product not found or not authorized" });
      }
  
      product.name = name;
      product.description = description;
      product.price = price;
      await product.save();
  
      res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("Error editing product:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  





const getOrdersOnMyProduct = async (req, res) => {

try {
    const userId = req.user.id;
    const userProducts = await Product.find({ userId }).select('_id');
    if (!userProducts.length) {
      return res.status(200).json({
        message: "No products found for this user",
        orders: [],
      });
    }

    const productIds = userProducts.map(product => product._id);

    const products = await Product.find({ _id: { $in: productIds } }).populate({
      path: "orders",
      populate: [
        { path: "userId", select: "name email username" },
        { path: "products", populate: { path: "userId", select: "name email username" } },
      ],
    });

    const orders = [];
    const orderIds = new Set();

    products.forEach(product => {
      product.orders.forEach(order => {
        if (!orderIds.has(order._id.toString())) {
          orderIds.add(order._id.toString());
          orders.push(order);
        }
      });
    });

    res.status(200).json({
      message: "User products orders fetched successfully",
      orders
    });
  } catch (error) {
    console.error("Error fetching user products orders:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
  };
  

  
  const getMyOrders = async (req, res) => {

   try {
    const userId = req.user.id;
    const user = await Users.findById(userId)
      .populate({
        path: "orders",
        populate: { path: "userId", select: "username email" },
        populate:{path:"products"}
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User orders fetched successfully",
      orders: user.orders || [],
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
  };
  
  
export {
    deleteProduct,
    editProduct,
    getMyOrders,
    getOrdersOnMyProduct,
    getUserProducts
  };