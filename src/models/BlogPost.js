const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: {
      type: String,
      required: [true, 'Please add a slug'],
      unique: true,
      trim: true,
      lowercase: true
    },
    excerpt: {
      type: String,
      required: [true, 'Please add an excerpt'],
      maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    content: {
      type: String,
      required: [true, 'Please add content']
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL']
    },
    date: {
      type: String,
      required: [true, 'Please add a date']
    },
    likes: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BlogPost', BlogPostSchema);
