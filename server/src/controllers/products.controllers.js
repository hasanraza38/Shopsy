import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Products from "../models/products.models.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";




//Add Product
const addProduct = async (req, res) => {
  const { name, description, price } = req.body;
  const userId =  req.user.id;

  if (!name)
    return res.status(400).json({ message: "product name is required" });
  if (!description)
    return res.status(400).json({ message: "product description is required" });
  if (!price)
    return res.status(400).json({ message: "product price is required" });

  try {
    
console.log(userId);

    const product = await Products.create({
      name,
      description,
      // image: imageUrl,
      userId,
      price
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
//Add Product



// get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find({}).populate('userId', "username email");
    res.status(200).json({
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
// get all products


// get single product
const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Not valid Id" });
  }

  const product = await Products.findById(id).populate('userId', "username email ");
  if (!product) {
    res.status(404).json({
      message: "no product found",
    });
  }
  res.status(200).json(product);
};
// get single product







export {
  addProduct,
  getAllProducts,
  getSingleProduct,
  
};
