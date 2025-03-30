const Subscription = require('../models/Subscription');
const nodemailer = require('nodemailer');
const { verifyRecaptcha } = require('../utils/recaptcha');

// @desc    Create new subscription
// @route   POST /api/subscription
// @access  Public
exports.createSubscription = async (req, res) => {
  try {
    // Verify reCAPTCHA token
    const { recaptchaToken, ...subscriptionData } = req.body;
    
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
    
    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ email: subscriptionData.email });
    
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        error: 'This email is already subscribed'
      });
    }

    const subscription = await Subscription.create(subscriptionData);

    // Send welcome email
    await sendWelcomeEmail(subscription);

    res.status(201).json({
      success: true,
      data: subscription
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

// @desc    Get all subscriptions
// @route   GET /api/subscription
// @access  Private
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Unsubscribe email
// @route   PUT /api/subscription/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email address'
      });
    }

    const subscription = await Subscription.findOne({ email });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    subscription.isSubscribed = false;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed',
      data: subscription
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete subscription
// @route   DELETE /api/subscription/:id
// @access  Private
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    await subscription.deleteOne();

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

// Helper function to send welcome email
const sendWelcomeEmail = async (subscription) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Setup email data
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: subscription.email,
      subject: 'Welcome to Aadil Rasheed Blog Newsletter',
      html: `
        <h2>Thank you for subscribing!</h2>
        <p>Dear ${subscription.firstName} ${subscription.lastName},</p>
        <p>Thank you for subscribing to Aadil Rasheed's blog newsletter. You will now receive updates on new posts and content.</p>
        <p>Best regards,</p>
        <p>Aadil Rasheed</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};
