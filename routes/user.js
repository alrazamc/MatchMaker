const router = require('express').Router();
const { authCheck } = require('../utils/middlewares');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Request = require('../models/Request');
const Task = require('../models/Task');
const { getProfileWithImageUrls, createAuthUser } = require('../utils');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');

router.use(authCheck);

router.get('/profile', async (req, res) => {
    try
    {
      let profile = await Profile.findOne({ userId: req.user._id });
      profile = await getProfileWithImageUrls(profile);
      profile.requests = await Request.find({$or: [{from: profile._id}, {to: profile._id}]});
      res.json({
        user: req.user,
        profile: profile,
        systemVersion: process.env.SYSTEM_VERSION
      });
    }catch(err)
    {
      res.json({message: err.message});
    }
});

router.post('/validate', async (req, res) => {
  try
  {
    const exists = {
      email: false,
      phoneNumber: false
    }
    if(req.body.email)
    {
      let users = await User.find({ email: req.body.email, _id: {$ne: req.user._id} });
      if(users && users.length)
        exists.email = "This email is already registered. Please use a different email address";
    }
    if(req.body.phoneNumber)
    {
      let users = await User.find({ phoneNumber: req.body.phoneNumber, _id: {$ne: req.user._id} });
      if(users && users.length)
        exists.phoneNumber = "This number is already registered. Please use a different number";
    }
    res.json(exists);
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
});

router.post('/settings', async (req, res) => {
  try
  {
    if(!req.body.email && !req.body.phoneNumber)
      throw new Error('Please specify either email address or mobile number');
    if(req.body.email)
    {
      let users = await User.find({ email: req.body.email, _id: {$ne: req.user._id} });
      if(users && users.length)
        throw new Error("This email is already registered. Please use a different email address");
    }
    if(req.body.phoneNumber)
    {
      let users = await User.find({ phoneNumber: req.body.phoneNumber, _id: {$ne: req.user._id} });
      if(users && users.length)
        throw new Error("This number is already registered. Please use a different number");
    }
    if(req.user.hasPassword)
    {
      if(!req.body.currentPassword)
        throw new Error('Current password is required');
      const result = await User.findOne({_id: req.user._id});
      if(result === null || !( await bcrypt.compare(req.body.currentPassword, result.password)) )
        throw new Error('Current password is invalid');
    }
    const data = {
      email: req.body.email,
      phoneNumber: req.body.phoneNumber
    };
    if(req.body.newPassword)
      data.password = await bcrypt.hash(req.body.newPassword, 10);
    await User.updateOne({_id: req.user._id }, data, {runValidators: true});
    const user = await User.findOne({_id: req.user._id });
    res.json( createAuthUser(user.toObject()) );
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
});

router.post('/hide', async (req, res) => {
  try
  {
    if(!req.body.hideDays)
      throw new Error('Please specify the number of days');
    if(req.body.hideDays < 6 || req.body.hideDays > 30)
      throw new Error("Number of days should be between 6 and 30 days");
      
    const data = {
      'status.hidden': true,
      'status.hiddenOn': moment().tz('GMT').toDate(),
      'status.activateProfileOn': moment().tz('GMT').add('d', req.body.hideDays).toDate()
    };
    await User.updateOne({_id: req.user._id }, data, {runValidators: true});
    await Profile.updateOne({userId: req.user._id }, { active: false }, {runValidators: true});
    const user = await User.findOne({_id: req.user._id });
    res.json( createAuthUser(user.toObject()) );
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
});

router.post('/activate', async (req, res) => {
  try
  {
    if(req.user.status.hidden && !req.user.status.suspended)
    {
      await User.updateOne({_id: req.user._id }, { 'status.hidden': false }, {runValidators: true});
      await Profile.updateOne({userId: req.user._id }, { active: true }, {runValidators: true});
    }
    const user = await User.findOne({_id: req.user._id });
    res.json( createAuthUser(user.toObject()) );
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
});

router.post('/delete', async (req, res) => {
  try
  {
    if(!req.body.reason)
      throw new Error("Please specify a reason");
    const data = {
      'status.deleted': true,
      'status.deletedOn': moment().tz('GMT').toDate(),
      'status.deleteReason': req.body.reason,
      'status.deleteReasonText': req.body.deleteReasonText ? req.body.deleteReasonText : ''
    };
    await User.updateOne({_id: req.user._id }, data, {runValidators: true});
    const profile = await Profile.findOne({userId: req.user._id });
    if(profile)
    {
      await Profile.deleteOne({_id: profile.id});
      if(profile.photos && profile.photos.images && profile.photos.images.length)
      {
        const keys = [
          ...profile.photos.images.map(img => ({ Key: `${req.user._id}/${img.fileName}`})),
          ...profile.photos.images.map(img => ({ Key: `${req.user._id}/thumbs/${img.fileName}`})),
          ...profile.photos.images.map(img => ({ Key: `${req.user._id}/protected/${img.fileName}`}))
        ]
        await new Task({userId: req.user._id,  name: "deleteS3Objects", args: [keys] }).saveAndRun();
      }
    }
    res.json( { message: "Account deleted successfully" } );
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
});
module.exports = router;