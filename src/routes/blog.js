const express = require('express');
const {
  getBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getBlogPosts)
  .post(protect, createBlogPost);

router
  .route('/:slug')
  .get(getBlogPostBySlug);

router
  .route('/id/:id')
  .get(protect, getBlogPostById)
  .put(protect, updateBlogPost)
  .delete(protect, deleteBlogPost);

router
  .route('/:id/like')
  .put(likeBlogPost);

module.exports = router;
