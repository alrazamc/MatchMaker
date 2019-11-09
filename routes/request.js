const router = require('express').Router();
const { authCheck, loadProfile } =  require('../utils/middlewares');
const Request = require('../models/Request');
const moment = require('moment-timezone');
const Profile = require('../models/Profile');

router.use(authCheck);
router.use(loadProfile);
router.use(async(req, res, next) => {
  try
  {
    if(!req.body.to && !req.body.from)
      throw new Error('ID is required');
    if(!req.body.status) //NOt Inbox request
    {
      if(!req.body.type)
      throw new Error('Type is required');
      const request = {
        from: req.body.from ? req.body.from : req.profile._id,
        to: req.body.to ? req.body.to : req.profile._id,
        type: req.body.type
      }
      req.request = request;
      req.dbRequest = await Request.findOne(request);
    }
    next();
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
})

router.post('/send', async(req, res) => {
  try
  {
    if(req.dbRequest && req.dbRequest.get('status') === 0)//cancelled request
    {
      req.dbRequest.set('status', 1);
      req.dbRequest.set('requestTime', moment().tz('GMT').toDate());
      req.dbRequest.set('lastUpdated', moment().tz('GMT').toDate());
      await req.dbRequest.save();
    }else
    {
      req.request.status = 1;//pending
      req.request.requestTime = moment().tz('GMT').toDate();
      req.request.lastUpdated = moment().tz('GMT').toDate();
      await new Request(req.request).save();  
    }
    res.json({ success: true});
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
})

router.post('/cancel', async(req, res) => {
  try
  {
    if(!req.dbRequest) throw new Error("Request doesn't exist");
    if(req.dbRequest.get('status') !== 1)
      throw new Error("Request not pending");
    req.dbRequest.set('status', 0);
    req.dbRequest.set('lastUpdated', moment().tz('GMT').toDate());
    await req.dbRequest.save();
    res.json({ success: true});
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
})

router.post('/accept', async(req, res) => {
  try
  {
    if(!req.dbRequest) throw new Error("Request doesn't exist");
    await Request.updateOne(req.request, {status: 2, lastUpdated: moment().tz('GMT').toDate()}); //2=> accepted
    res.json({ success: true});
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
})

router.post('/decline', async(req, res) => {
  try
  {
    if(!req.dbRequest) throw new Error("Request doesn't exist");
    await Request.updateOne(req.request, {status: 3, lastUpdated: moment().tz('GMT').toDate()}); //3=> declined
    res.json({ success: true});
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
})

router.post('/list', async(req, res) => {
  try
  {
    const conditions = {}
    const filters = req.body;
    const myProfileId = req.profile._id.toString();
    if(filters.from && filters.from !== myProfileId)
      throw new Error("Invalid request");
    if (filters.to && filters.to !== myProfileId)
      throw new Error("Invalid request");
    if(filters.from && filters.to)
      conditions["$or"] = [{from: filters.from}, {to: filters.to}];
    else if(filters.from)
      conditions['from'] = filters.from;
    else if(filters.to)
      conditions['to'] =filters.to;
    if(filters.status)
      conditions['status'] = filters.status;
    const sortField = filters.sortBy ? filters.sortBy : 'lastUpdated';

    const paginationLimit = parseInt(process.env.PAGINATION_LIMIT);
    const pageNumber = filters.pageNumber ? parseInt(filters.pageNumber) - 1: 0;

    let requests = await Request.find(conditions).sort({ [sortField]: -1 }).skip(pageNumber * paginationLimit).limit(paginationLimit);
    const total = await Request.countDocuments(conditions);
    let profiles = [];
    const profileIds = requests.map(item => item.from.toString() === myProfileId ? item.to : item.from);
    if (profileIds.length)
    {
      const selectFields = {
        _id: 1,
        userId: 1,
        "basicInfo.firstName": 1,
        "basicInfo.lastName": 1,
        "basicInfo.gender": 1,
        "basicInfo.dateOfBirth": 1,
        "basicInfo.maritalStatus": 1,
        "basicInfo.height": 1,

        "religionCaste.religion": 1,
        "religionCaste.community": 1,
        "religionCaste.motherTongue": 1,

        "location.country": 1,
        "location.state": 1,
        "location.city": 1,

        "educationCareer.educationLevel": 1,
        "educationCareer.educationField": 1,
        "educationCareer.workingWith": 1,
        "educationCareer.workingAs": 1,
        "photos": 1,
        "profileDescription": 1,
        "lastActive": 1,
        "joinedOn": 1,
        "lastUpdated": 1
      }
      profiles = await Profile.find({ _id: { $in: profileIds}}, selectFields);
      const currentTime = moment().tz('GMT').toDate();
      profiles = await Promise.all(profiles.map(async profile => {
        let user = await getProfileWithImageUrls(profile, req.profile);
        user.currentTime = currentTime;
        return user;
      }));
    }
    const response = {
      profiles,
      requests,
      totalRecords: total,
      perPage: paginationLimit,
      pageNumber: filters.pageNumber ? filters.pageNumber : 1
    };
    res.json(response);
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
})

module.exports = router;