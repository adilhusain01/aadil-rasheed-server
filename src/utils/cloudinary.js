const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const logger = require('./logger');

// Use the root .env file instead of config.env to match the server configuration
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image or file to Cloudinary
const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'aadil_blog',
      use_filename: true,
      resource_type: 'auto' // Auto-detect resource type (image, video, raw)
    });
    
    logger.info(`Successfully uploaded file to Cloudinary: ${result.public_id}`);
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      resource_type: result.resource_type,
      created_at: result.created_at
    };
  } catch (error) {
    logger.error(`Error uploading to Cloudinary: ${error.message}`);
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

// Delete image or file from Cloudinary
const deleteImage = async (publicId) => {
  try {
    // First, determine the resource type
    let resourceType = 'image'; // Default to image
    
    // Check if the public_id contains a resource type indicator
    if (publicId.includes('video')) {
      resourceType = 'video';
    } else if (publicId.includes('raw')) {
      resourceType = 'raw';
    }
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete from Cloudinary: ${result.result}`);
    }
    
    logger.info(`Successfully deleted file from Cloudinary: ${publicId}`);
    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    logger.error(`Error deleting from Cloudinary: ${error.message}`);
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

module.exports = { uploadImage, deleteImage };
