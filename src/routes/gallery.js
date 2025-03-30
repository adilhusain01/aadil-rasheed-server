const express = require('express');
const {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} = require('../controllers/galleryController');

const router = express.Router();

router
  .route('/')
  .get(getGalleryImages)
  .post(createGalleryImage);

router
  .route('/:id')
  .put(updateGalleryImage)
  .delete(deleteGalleryImage);

module.exports = router;
