const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { 
  uploadMedia, 
  deleteMedia, 
  getUploads, 
  getUploadById 
} = require('../controllers/uploadController');

const router = express.Router();

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.resolve('src/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'src/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Accept images, videos, PDFs, and documents
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|pdf|doc|docx|xls|xlsx|ppt|pptx|txt/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: Only images, videos, PDFs, and common document formats are allowed!'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter
});

// Routes
router.route('/')
  .get(protect, getUploads)
  .post(protect, upload.array('files', 10), uploadMedia);

router.route('/:id')
  .get(protect, getUploadById)
  .delete(protect, deleteMedia);

module.exports = router;
