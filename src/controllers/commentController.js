const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');
const { verifyRecaptcha } = require('../utils/recaptcha');

// @desc    Get comments for a blog post
// @route   GET /api/blog/:blogId/comments
// @access  Public
exports.getBlogComments = async (req, res) => {
  try {
    // Find only top-level comments (no parent)
    const comments = await Comment.find({ 
      blogId: req.params.blogId,
      parentId: null,
      isApproved: true
    })
    .sort('-createdAt')
    .populate({
      path: 'replies',
      match: { isApproved: true },
      options: { sort: { createdAt: 1 } }
    });
    
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new comment
// @route   POST /api/blog/:blogId/comments
// @access  Public
exports.createComment = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    
    // Verify blog post exists
    const blogExists = await BlogPost.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }
    
    // Verify reCAPTCHA
    const { recaptchaToken, ...commentData } = req.body;
    
    if (!recaptchaToken) {
      return res.status(400).json({
        success: false,
        error: 'Bot verification token is required'
      });
    }
    
    const isVerified = await verifyRecaptcha(recaptchaToken);
    if (!isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Bot verification failed. Please try again.'
      });
    }
    
    // Create comment
    const comment = await Comment.create({
      ...commentData,
      blogId
    });

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      console.error('Error creating comment:', error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Create reply to a comment
// @route   POST /api/blog/comments/:commentId/replies
// @access  Public
exports.replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    // Verify parent comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({
        success: false,
        error: 'Parent comment not found'
      });
    }
    
    // Verify reCAPTCHA
    const { recaptchaToken, ...replyData } = req.body;
    
    if (!recaptchaToken) {
      return res.status(400).json({
        success: false,
        error: 'Bot verification token is required'
      });
    }
    
    const isVerified = await verifyRecaptcha(recaptchaToken);
    if (!isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Bot verification failed. Please try again.'
      });
    }
    
    // Create reply
    const reply = await Comment.create({
      ...replyData,
      blogId: parentComment.blogId,
      parentId: commentId
    });

    res.status(201).json({
      success: true,
      data: reply
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      console.error('Error creating reply:', error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete a comment
// @route   DELETE /api/blog/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Also delete all replies to this comment
    await Comment.deleteMany({ parentId: req.params.id });
    
    // Delete the comment itself
    await comment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Approve a comment
// @route   PUT /api/blog/comments/:id/approve
// @access  Private
exports.approveComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    comment.isApproved = true;
    await comment.save();

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Error approving comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all comments (for admin)
// @route   GET /api/blog/comments
// @access  Private
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .sort('-createdAt')
      .populate({
        path: 'blogId',
        select: 'title slug'
      });
    
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    console.error('Error fetching all comments:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
