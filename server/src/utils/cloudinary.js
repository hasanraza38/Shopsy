import {v2 as cloudinary} from "cloudinary"
import { log } from "console";
import fs from "fs"
import dotenv from "dotenv";
dotenv.config();


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});





// const uploadImageToCloudinary = async (localpath) => {
//   console.log(localpath);
  
//   try {
//     const uploadResult = await cloudinary.uploader.upload(localpath, {
//       resource_type: "auto",
//     });
    
//     fs.unlinkSync(localpath);
    
//     return uploadResult.url;
//   } catch (error) {
//     fs.unlinkSync(localpath);
//     return null;
//   }
// };


const uploadImageToCloudinary = async (localpath) => {

  try {
    const uploadResult = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });

    console.log("Upload success:", uploadResult);
    fs.unlinkSync(localpath); 
    return uploadResult.url;

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    
    if (fs.existsSync(localpath)) {
      fs.unlinkSync(localpath); 
    }

    return null;
  }
};




export {uploadImageToCloudinary}