import Product from "../models/products.models.js";
import Order from "../models/order.models.js";
import mongoose from "mongoose";
  

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
  





const getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate("user", "name email")
        .populate({
          path: "products",
          populate: { path: "userId", select: "name email" },
        });
  
      res.status(200).json({
        message: "Orders fetched successfully",
        orders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  

  
  const getOrderedProducts = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id }).populate({
        path: "products",
        populate: { path: "userId", select: "name email" },
      });
  
      const products = [];
      const productIds = new Set(); 
  
      orders.forEach((order) => {
        order.products.forEach((product) => {
          if (!productIds.has(product._id.toString())) {
            productIds.add(product._id.toString());
            products.push(product);
          }
        });
      });
  
      res.status(200).json({
        message: "Ordered products fetched successfully",
        products,
      });
    } catch (error) {
      console.error("Error fetching ordered products:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  
export {
    deleteProduct,
    editProduct,
    getUserOrders,
    getOrderedProducts,
  };