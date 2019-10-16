const jwt = require('jsonwebtoken');

const createJwtToken = (user) => {
  const payload = {
    uid: user._id, 
    phoneNumber: user.phoneNumber,
    email: user.email
  }
  return jwt.sign(payload, process.env.JWT_SIGN_KEY);
}

module.exports = { createJwtToken };