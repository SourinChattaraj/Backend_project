import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // File system module to handle file operations(defalut in node.js)

 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET  
    });


const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
        // file upload to cloudinary
      const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
        })
        fs.unlinkSync(localFilePath); // Delete the local file after upload
        // If the upload is successful, delete the local file
        return {
             url: response.url,
            public_id: response.public_id
}; // Return the URL of the uploaded file
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        fs.unlinkSync(localFilePath); // Delete the local file if upload fails
        return null; // Return null if upload fails
    }
}
export {uploadOnCloudinary}