const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  
  console.log('Auth middleware - Cookies:', req.cookies);
  console.log('Auth middleware - Headers:', req.headers);

  // Check for token in various places
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    console.log('Token found in Authorization header:', token.substring(0, 10) + '...');
  } 
  // Set token from cookie
  else if (req.cookies?.token) {
    token = req.cookies.token;
    console.log('Token found in cookies:', token.substring(0, 10) + '...');
  }
  // Check URL parameters for token (less secure but useful for debugging)
  else if (req.query?.token) {
    token = req.query.token;
    console.log('Token found in query parameters:', token.substring(0, 10) + '...');
  }

  // Make sure token exists
  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    console.log('Verifying JWT token with secret');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, user ID:', decoded.id);

    // Find user and attach to request
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log('User not found with ID:', decoded.id);
      return res.status(401).json({
        success: false,
        error: 'User no longer exists'
      });
    }
    
    console.log('User found:', user.name);
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({
      success: false,
      error: 'Token invalid or expired'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user?.role} not authorized to access this route`
      });
    }
    next();
  };
};
