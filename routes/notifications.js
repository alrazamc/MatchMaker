const router = require('express').Router();
const { authCheck, loadProfile } =  require('../utils/middlewares');
const { Notification, notificationTypes  } = require('../models/Notification');
const Request = require('../models/Request');
const Profile = require('../models/Profile');
const { getProfileWithImageUrls } = require('../utils');
const moment = require('moment-timezone');


router.use(authCheck);
router.use(loadProfile);

router.get('/', async (req, res) => {
  try
  {
    const time = moment().tz('GMT').toDate();
    await Profile.updateOne({_id: req.profile.id}, { lastActive: time }, {runValidators: true});

    const filters = req.query;
    const conditions = { to: req.profile.id }
    if(req.profile.blocked && req.profile.blocked.length)
      conditions['from'] = {$nin: req.profile.blocked};
    if(filters.after)
      conditions['time'] = {$gt: filters.after}
    if(filters.before)
      conditions['time'] = {$lt: filters.before}
    let notifications = await Notification.find(conditions).populate('from').sort({ time: -1 }).limit(10);
    req.profile.requests = await Request.find({$or: [{from: req.profile._id}, {to: req.profile._id}]});
    const currentTime = moment().tz('GMT').toDate();
    notifications = await Promise.all(notifications.map(async item => {
        if(!item.from) return false;
        let profile = await getProfileWithImageUrls(item.from, req.profile);
        item = item.toObject();
        item.from = profile._id;
        item.profile = {
          _id: profile._id,
          photos: profile.photos,
          lastActive: profile.lastActive,
          currentTime,
          basicInfo: {
            firstName: profile.basicInfo.firstName,
            lastName: profile.basicInfo.lastName,
            gender: profile.basicInfo.gender
          }
        }
        let name = profile._id.toString().substring(0, 6);
        if(profile.basicInfo && profile.basicInfo.firstName)
          name = profile.basicInfo.firstName + ' ' + profile.basicInfo.lastName;
        switch(item.type){
          case notificationTypes.PROFILE_VIEWED:
            item.text = `${name} viewed your profile`;break;
          case notificationTypes.NEW_CONNECT_REQUEST:
            item.text = `${name} sent you a connect request`;break;
          case notificationTypes.NEW_PHOTO_REQUEST:
            item.text = `${name} asked for your photo`;break;
          case notificationTypes.CONNECT_REQUEST_ACCEPTED:
            item.text = `${name} accepted your connect request`;break;
          case notificationTypes.PHOTO_REQUEST_ACCEPTED:
            item.text = `${name} sent you a photo`;break;
          case notificationTypes.CONNECT_REQUEST_DECLINED:
            item.text = `${name} politely declined your connect request`;break;
          case notificationTypes.PHOTO_REQUEST_DECLINED:
            item.text = `${name} politely declined your photo request`;break;
          case notificationTypes.PROFILE_SHORTLISTED:
            item.text = `${name} shortlisted your profile`;break;
          case notificationTypes.PROFILE_BLOCKED:
            item.text = `${name} blocked your profile`;break;
          case notificationTypes.PROFILE_UNBLOCKED:
            item.text = `${name} unblocked your profile`;break;
        }
        return item;
      }));

    res.json(notifications.filter(item => item !== false));
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
});

router.post('/seen', async (req, res) => {
  try
  {
    const filters = req.body;
    if(!filters.profileId)
      throw new Error("ID required");
    await Notification.updateMany({to: filters.profileId}, {isSeen: true}, {runValidators: true});
    res.json({success: true});
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
});

module.exports = router;