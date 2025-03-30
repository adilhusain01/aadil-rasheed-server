const express = require('express');
const {
  getBlogComments,
  createComment,
  replyToComment,
  deleteComment,
  approveComment,
  getAllComments
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getBlogComments)
  .post(createComment);

router
  .route('/all')
  .get(protect, getAllComments);

router
  .route('/:commentId/replies')
  .post(replyToComment);

router
  .route('/:id')
  .delete(protect, deleteComment);

router
  .route('/:id/approve')
  .put(protect, approveComment);

module.exports = router;
