import { v2 as cloudinary } from "cloudinary";

export const deleteOldCloudinary = async (imageURL) => {
  if (!imageURL) return;
  
  try {
    // Extract just the filename without extension
    const parts = imageURL.split('/');
    const fileWithExt = parts[parts.length-1];
    const publicId = fileWithExt.split('.')[0];

    const result = await cloudinary.uploader.destroy(publicId);
    // console.log("Cloudinary delete result:", result);
    
    if (result.result === 'ok') {
      return true;
    } else {
      console.warn('Cloudinary delete result:', result);
      return false;
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
}



