const express = require('express');
const {
  getSocialMediaLinks,
  createSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink,
  getAllSocialMediaLinksAdmin
} = require('../controllers/socialController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getSocialMediaLinks)
  .post(protect, createSocialMediaLink);

router
  .route('/:id')
  .put(protect, updateSocialMediaLink)
  .delete(protect, deleteSocialMediaLink);

router
  .route('/admin/all')
  .get(protect, getAllSocialMediaLinksAdmin);

module.exports = router;
