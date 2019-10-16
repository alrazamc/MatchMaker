const jwt = require('jsonwebtoken');
const User = require('../models/User');


const authCheck = (req, res, done) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer '))
    token = token.slice(7, token.length);
  const error = {
    error: true,
    redirect: '/login',
    message: 'Please login to continue'
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SIGN_KEY, (err, decoded) => {
      if (err) {
        return res.json(error);
      } else {
        User.findById(decoded.uid).then(result => {
          const user = {...result._doc};
          delete user.password; delete user.__v;
          req.user = user;
          done();
        }).catch(err => res.json(error));
      }
    });
  }else
    res.json(error);
}

module.exports = { authCheck };