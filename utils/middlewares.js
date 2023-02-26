const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { createAuthUser } = require('../utils');

const authCheck = async (req, res, done) => {
  try
  {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if(!token)
      throw new Error("");
    if (token.startsWith('Bearer '))
      token = token.slice(7, token.length);
    if(!token)
      throw new Error("");
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_PUBLIC_KEY, {algorithm : 'RS256'}, (err, decoded) => { if(err) reject(new Error("Invalid Request")); resolve(decoded) });
    });
    let user = await User.findById(decoded.uid);
    if(!user)
      throw new Error("User not found");
    user = user.toObject();
    if(user.status.deleted)
      throw new Error("Account Deleted");
    if(user.status.suspended)
      throw new Error("Account Suspended. Reason: " + user.status.suspendReason);
    req.user = createAuthUser( user );
    done();
  }catch(err)
  {
    res.status(401).json({message: err.message})
  }
}

const loadProfile = async (req, res, next) => {
  try
  {
    let profile = null;
    if(req.body.profileId)
      profile = await Profile.findOne({ _id: req.body.profileId });
    else
      profile = await Profile.findOne({ userId: req.user._id });
    if(!profile)
      profile = await new Profile({ userId: req.user._id }).save();
    if(profile.userId.toString() !== req.user._id.toString())
      throw new Error("Invalid Request");
    req.profile = profile;
    next();
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
}

module.exports = { 
  authCheck,
  loadProfile
};