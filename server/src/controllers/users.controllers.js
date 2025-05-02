import Users from "../models/users.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "zakary.champlin57@ethereal.email",
    pass: "rr173s9hvb5v3a5fhE",
  },
});
// nodemailer


//generate accesstoken
const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};
//generate accesstoken


// generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY ,
  });
};
// generate refresh token



//Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username) return res.status(400).json({ message: "user Name required" });
    if (!email) return res.status(400).json({ message: "email required" });
    if (!password) return res.status(400).json({ message: "password required" });

    const userName = await Users.findOne({ username: username });
    if (userName) return res.status(401).json({ message: "username not available" });

    const user = await Users.findOne({ email: email });
    if (user) return res.status(401).json({ message: "user already exist" });


    let imageUrl = null;

    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult) {
        return res
          .status(500)
          .json({ message: "Error occurred while uploading the image" });
      }
      imageUrl = uploadResult;
    }
    const createUser = await Users.create({
      username,
      email,
      password,
      avatar: imageUrl,      
    });

    res.status(201).json({ message: "user registered successfully", data: createUser });

    const info = await transporter.sendMail({
      from: '"Zakary Champlin" <zakary.champlin57@ethereal.email>',
      to: `${email}`,
      subject: "HEllO!!",
      text: `Welcome to our platform, ${username}`,
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
//Register User



// login User
const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username) return res.status(400).json({ message: "user Name required" });
  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  const user = await Users.findOne({ email });
  if (!user) return res.status(400).json({ message: "user not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
  return res.status(400).json({ message: "incorrect password" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);


  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "strict",
  }
  
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json({
    message: "user logged in successfuly",
    accessToken,
    refreshToken,
    data: user,

  }
)

};
// login User



// refresh token
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "refresh token not found" });
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

    const user = await Users.findOne({ email: decodedToken.email });
    if (!user) {
      return res.status(404).json({ message: "invalid token" });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
 const options = {
            httpOnly: true,
            secure: true
        }

  return res
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", newRefreshToken, options)
  .json({
       message: "access token generated",
       accessToken, 
       refreshToken: newRefreshToken }
    );
  }
  catch(error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// refresh token



// logout user
const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "user logout successfully" });
};
// logout user



// dashboard
const getDashboardData = async (req, res) => {
  try {
    // Get user from verifyJWT middleware
    const userId = req.userId;

    // Find user and populate products and orders
    const user = await Users.findById(userId)
      .select("-password") // Exclude password
      .populate({
        path: "Products",
        select: "name price description", // Select fields to return
      })
      .populate({
        path: "Order",
        select: "totalAmount status items", // Select fields to return
        populate: {
          path: "items.product",
          select: "name price",
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        products: user.products,
        orders: user.orders,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard data",
      error: error.message,
    });
  }
};
// dashboard



export { registerUser, loginUser, refreshToken, logoutUser, getDashboardData };
