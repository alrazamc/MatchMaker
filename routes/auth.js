const router = require('express').Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');
const { createAuthUser, createJwtToken, getPopupHtml, getFailedLoginHtml, getProfileWithImageUrls } = require('../utils');
const passport  = require('passport');
const moment = require('moment-timezone');

router.post('/signup', async (req, res) => {
  const required = ["password", "firstName", "lastName", "gender", "dateOfBirth"];
  try
  {
    for(let key in required)
      if(!req.body[ required[key] ])
        throw new Error(required[key] + " is required");
    const user = {};
    if(req.body.phoneNumber)
    {
      if(typeof req.body.phoneNumber !== 'string' || req.body.phoneNumber.length > 11) //regex compare - performance bottle neck for malicious input
        throw new Error("Invalid phone number");
      user.phoneNumber = req.body.phoneNumber;
    }
    else if(req.body.email)
    {
      if(typeof req.body.email !== 'string' || req.body.email.length > 60) //regex compare - performance bottle neck for malicious input 
        throw new Error("Invalid email address");
      user.email = req.body.email;
    }
    else
      throw new Error("Please provide either email or phone number");
    const result = await User.findOne(user);
    if(result !== null && req.body.phoneNumber)
      throw new Error("This number is already registered. Please use a different number");
    if(result !== null && req.body.email)
      throw new Error("This email is already registered. Please use a different email address");
    user.password = await bcrypt.hash(req.body.password, 10);
    user.lastLoggedIn = moment().tz('GMT').toDate();
    const userDoc = await new User(user).save();
    const profileDoc = {
      userId: userDoc._id,
      basicInfo:{
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth
      }};
    const profile = await new Profile(profileDoc).save();
    const userObj = userDoc.toObject();
    const response = {
      user: createAuthUser(userObj),
      profile: profile,
      token: await createJwtToken(userObj),
      fbtoken: await createJwtToken(userObj, 1)
    }
    res.json(response);
  }catch(err)
  {
    res.status(400).json({message: err.message})
  }
});

router.post('/signin', async (req, res) => {
  try
  {
    if(!req.body.password)
      throw new Error("Password is required");
    const conditions = {};
    if(req.body.phoneNumber)
      conditions.phoneNumber = req.body.phoneNumber;
    else if(req.body.email)
      conditions.email = req.body.email;
    else
      throw new Error("Please provide either email or phone number");
    const user = await User.findOne(conditions);
    if(user === null || !(await bcrypt.compare(req.body.password, user.password)) )
      throw new Error("Invalid Phone/Email or Password");
    if(user.status.suspended)
      throw new Error("Account Suspended, Reason: " + user.status.suspendReason);
    if(user.status.deleted)
      throw new Error("Account Deleted");
    let profile = await Profile.findOne({ userId: user._id });
    profile = await getProfileWithImageUrls(profile);
    await user.updateLastLoggedIn();
    const userObj = user.toObject();
    res.json({
      user: createAuthUser(userObj),
      profile: profile,
      token: await createJwtToken(userObj),
      fbtoken: await createJwtToken(userObj, 1)
    });
  }catch(err)
  {
    return res.status(400).json({message: err.message});
  }
});

//auth with google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

//handle redirect
router.get('/google/redirect', passport.authenticate('google', { session:false }), async (req, res) => {
  if(req.user && (req.user.status.deleted || req.user.status.suspended))
  {
    const errorMsg = req.user.status.deleted ? 'Account Deleted' : `Account suspended. Reason: ${req.user.status.suspendReason} `;
    res.send( getFailedLoginHtml(errorMsg) );
  }else
  {
    const token = await createJwtToken(req.user);
    const fbtoken = await createJwtToken(req.user, 1);
    res.send( getPopupHtml(token, fbtoken) );
  }
});

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

//handle redirect
router.get('/facebook/redirect', passport.authenticate('facebook', { session:false, failureRedirect: 'https://facebook.com' }), async (req, res) => {
  if(req.user && (req.user.status.deleted || req.user.status.suspended))
  {
    const errorMsg = req.user.status.deleted ? 'Account Deleted' : `Account suspended. Reason: ${req.user.status.suspendReason} `;
    res.send( getFailedLoginHtml(errorMsg) );
  }else
  {
    const token = await createJwtToken(req.user);
    const fbtoken = await createJwtToken(req.user, 1);
    res.send( getPopupHtml(token, fbtoken) );
  }
});

router.post('/resetPassword', async (req, res) => {
  try
  {
    let user = null;
    if(!req.body.email)
      throw new Error("Email address is required");
    if(req.body.code)
      user = await User.findOne({ email: req.body.email, passwordResetCode: req.body.code });
    else
      user = await User.findOne({ email: req.body.email });
    
    if(user === null && req.body.code)
      throw new Error("invalid verification code");
    else if(user === null)
      throw new Error("This email address is not registered");

    if(user.status.suspended)
      throw new Error("Account Suspended, Reason: " + user.status.suspendReason);
    if(user.status.deleted)
      throw new Error("Account Deleted");
    if(req.body.code && req.body.codeVerified)
    {
      if(!req.body.password)
        throw new Error("Password is required");
      const newPassword = await bcrypt.hash(req.body.password, 10);
      user.set('password', newPassword);
      user.set("passwordResetCode", '');
      await user.save(); 
    }else if(!req.body.code) //just email
    {
      await new Task({userId: user.id,  name: "sendResetPasswordEmail", args: [user.id] }).saveAndRun();
    }
    res.send({success: true});
  }catch(err)
  {
    return res.status(400).json({message: err.message});
  }
});


module.exports = router;