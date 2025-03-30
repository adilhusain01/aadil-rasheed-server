const axios = require('axios');

/**
 * Verifies a reCAPTCHA token with Google's API
 * @param {string} token - The reCAPTCHA token to verify
 * @returns {Promise<boolean>} Whether the token is valid
 */
const verifyRecaptcha = async (token) => {
  if (!token) return false;
  
  // For development, accept Google's test token
  if (token === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' && process.env.NODE_ENV === 'development') {
    return true;
  }
  
  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; // Default to Google's test secret key
  const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
  
  try {
    const response = await axios.post(
      verificationUrl, 
      null, 
      {
        params: {
          secret: secretKey,
          response: token
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
};

module.exports = { verifyRecaptcha };
