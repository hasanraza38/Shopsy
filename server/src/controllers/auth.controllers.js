import Users from "../models/auth.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import sendEmail from "../utils/mail.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";



//Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username) return res.status(400).json({ message: "user Name required" });
    if (!email) return res.status(400).json({ message: "email required" });
    if (!password) return res.status(400).json({ message: "password required" });

    const userName = await Users.findOne({ username: username });
    if (userName) return res.status(401).json({ message: "user already exist with username" });

    const user = await Users.findOne({ email: email });
    if (user) return res.status(401).json({ message: "user already exist with email" });


    let imageUrl = null;

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(req.file.path);
      // console.log(uploadResult);
      
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
    sendEmail(email, username);
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
//Register User



// login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

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
      secure: true,
      sameSite: "None"
  }
  
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json({
    message: "user logged in successfuly",
  }
)

};
// login User





// authorize user
 const authorizeUser = async (req, res) => {
  try {

    const user = await Users.findById(req.user.id).select('-password'); 

    if (!user) {
      return res.status(404).json({ isAuthenticated: false, message: 'User not found' });
    }

    res.status(200).json({
      isAuthenticated: true,
      user:{  
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        username: user.username,
      },
    }); 
  } catch (error) {
    console.error('Check Auth Error:', error);
    res.status(401).json({ isAuthenticated: false, message: 'Not authenticated' });
  }
}
// authorize user





// refresh token
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    res.cookie('accessToken', accessToken, 
      {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
       });
    res.json({ message: 'Token refreshed' });
  });
};

// refresh token



// logout user
const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken",{
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });
  res.clearCookie("accessToken",{
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });
  res.json({ message: "user logout successfully" });
};
// logout user




const uploadImage = async (req, res) => {
  if (!req.file)
    return res.status(400).json({
      message: "no image file uploaded",
    });
    // console.log(req.file.path);
    

  try {
    const uploadResult = await uploadImageToCloudinary(req.file.path);

    if (!uploadResult)
      return res
        .status(500)
        .json({ message: "error occured while uploading image" });

    res.json({
      message: "image uploaded successfully",
      url: uploadResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error occured while uploading image" });
  }
};




export { registerUser, loginUser, refreshToken, logoutUser, authorizeUser,uploadImage};
