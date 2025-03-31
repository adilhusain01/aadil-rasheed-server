const BlogPost = require("../models/BlogPost");

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
exports.getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find({ isPublished: true }).sort(
      "-createdAt"
    );

    res.status(200).json({
      success: true,
      count: blogPosts.length,
      data: blogPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get single blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
exports.getBlogPostBySlug = async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({
      slug: req.params.slug,
      isPublished: true,
    });

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blogPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get single blog post by ID
// @route   GET /api/blog/id/:id
// @access  Private
exports.getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blogPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Create new blog post
// @route   POST /api/blog
// @access  Private
exports.createBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.create(req.body);

    res.status(201).json({
      success: true,
      data: blogPost,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private
exports.updateBlogPost = async (req, res) => {
  try {
    let blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: blogPost,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private
exports.deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    await blogPost.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Increment likes for a blog post
// @route   PUT /api/blog/:id/like
// @access  Public
exports.likeBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    // Increment likes count
    blogPost.likes += 1;
    await blogPost.save();

    res.status(200).json({
      success: true,
      data: blogPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get all blog posts for admin dashboard
// @route   GET /api/blog/admin/all
// @access  Private
exports.getAllBlogPostsAdmin = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().sort("-createdAt");

    // Count published and unpublished posts
    const publishedPosts = blogPosts.filter((post) => post.isPublished).length;
    const unpublishedPosts = blogPosts.length - publishedPosts;

    res.status(200).json({
      success: true,
      count: blogPosts.length,
      publishedCount: publishedPosts,
      unpublishedCount: unpublishedPosts,
      data: blogPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
