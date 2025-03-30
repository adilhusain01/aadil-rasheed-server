const { uploadImage, deleteImage } = require('../utils/cloudinary');
const Upload = require('../models/Upload');
const fs = require('fs');
const logger = require('../utils/logger');

// @desc    Upload an image to Cloudinary and save to database
// @route   POST /api/upload
// @access  Private
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please upload at least one file'
      });
    }

    const uploadedFiles = [];
    const failedFiles = [];

    // Process each uploaded file
    for (const file of req.files) {
      try {
        // Upload image to Cloudinary
        const result = await uploadImage(file.path);
        
        // Create a new upload record in the database
        const upload = await Upload.create({
          filename: result.public_id,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: result.secure_url
        });

        // Add to successfully uploaded files
        uploadedFiles.push({
          _id: upload._id,
          filename: upload.filename,
          originalname: upload.originalname,
          mimetype: upload.mimetype,
          size: upload.size,
          url: upload.url,
          createdAt: upload.createdAt
        });

        // Remove file from server after upload
        fs.unlinkSync(file.path);
      } catch (error) {
        logger.error(`Upload failed for file ${file.originalname}: ${error.message}`);
        
        // Remove file from server if upload fails
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        
        failedFiles.push({
          name: file.originalname,
          error: error.message
        });
      }
    }

    // Return response with results
    res.status(200).json({
      success: true,
      data: uploadedFiles,
      failed: failedFiles.length > 0 ? failedFiles : undefined
    });
  } catch (error) {
    logger.error(`Upload media error: ${error.message}`);
    
    // Clean up any remaining files
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all uploads from database
// @route   GET /api/upload
// @access  Private
exports.getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: uploads.length,
      data: uploads
    });
  } catch (error) {
    logger.error(`Get uploads error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single upload by ID
// @route   GET /api/upload/:id
// @access  Private
exports.getUploadById = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);

    if (!upload) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    res.status(200).json({
      success: true,
      data: upload
    });
  } catch (error) {
    logger.error(`Get upload by ID error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete file from Cloudinary and database
// @route   DELETE /api/upload/:id
// @access  Private
exports.deleteMedia = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);

    if (!upload) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Delete from Cloudinary
    await deleteImage(upload.filename);

    // Delete from database
    await upload.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Delete media error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
