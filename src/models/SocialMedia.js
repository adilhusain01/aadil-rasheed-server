const mongoose = require('mongoose');

const SocialMediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['instagram', 'facebook', 'twitter'],
      default: 'instagram'
    },
    url: {
      type: String,
      required: [true, 'Please add the social media URL'],
      trim: true
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SocialMedia', SocialMediaSchema);
