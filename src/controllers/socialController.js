const SocialMedia = require('../models/SocialMedia');

// @desc    Get all social media links
// @route   GET /api/social
// @access  Public
exports.getSocialMediaLinks = async (req, res) => {
  try {
    const socialLinks = await SocialMedia.find({ isActive: true }).sort('displayOrder');
    
    res.status(200).json({
      success: true,
      count: socialLinks.length,
      data: socialLinks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new social media link
// @route   POST /api/social
// @access  Private
exports.createSocialMediaLink = async (req, res) => {
  try {
    const socialLink = await SocialMedia.create(req.body);

    res.status(201).json({
      success: true,
      data: socialLink
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Update social media link
// @route   PUT /api/social/:id
// @access  Private
exports.updateSocialMediaLink = async (req, res) => {
  try {
    let socialLink = await SocialMedia.findById(req.params.id);

    if (!socialLink) {
      return res.status(404).json({
        success: false,
        error: 'Social media link not found'
      });
    }

    socialLink = await SocialMedia.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: socialLink
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete social media link
// @route   DELETE /api/social/:id
// @access  Private
exports.deleteSocialMediaLink = async (req, res) => {
  try {
    const socialLink = await SocialMedia.findById(req.params.id);

    if (!socialLink) {
      return res.status(404).json({
        success: false,
        error: 'Social media link not found'
      });
    }

    await socialLink.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
