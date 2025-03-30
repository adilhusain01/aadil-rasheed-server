const express = require('express');
const {
  getSocialMediaLinks,
  createSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink
} = require('../controllers/socialController');

const router = express.Router();

router
  .route('/')
  .get(getSocialMediaLinks)
  .post(createSocialMediaLink);

router
  .route('/:id')
  .put(updateSocialMediaLink)
  .delete(deleteSocialMediaLink);

module.exports = router;
