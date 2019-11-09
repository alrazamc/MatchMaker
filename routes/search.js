const router = require('express').Router();
const { authCheck } = require('../utils/middlewares');
const { getProfileWithImageUrls } = require('../utils');
const moment = require('moment-timezone');
const Profile = require('../models/Profile');

router.use(authCheck);

router.post('/', async (req, res) => {
  try
  {
    const filters = req.body;
    let myProfile = null;
    if(filters.profileId)
      myProfile = await Profile.findById(filters.profileId);
    else
      myProfile = await Profile.findOne({userId: req.user._id});
    //Basic Info
    const conditions = {
      active: true,
      'basicInfo.gender': filters.gender ? filters.gender : 1,
      userId: {$ne: req.user._id}
    };
    if(myProfile && myProfile.blocked && myProfile.blocked.length)
      conditions['_id'] = { $nin: myProfile.blocked } //not blocked by me
    if(myProfile && myProfile.filtered && myProfile.filtered.length)
      conditions['_id'] = { $nin: myProfile.filtered } //not filtered by me
    if(myProfile)
      conditions['blocked'] ={ $nin: [myProfile.id] }; // didn't blocked my
    
    //show only profiles that I have not viewed
    if(filters.notViewedOnly && myProfile && myProfile.viewed && myProfile.viewed.length)
      conditions['_id'] = { $nin: myProfile.viewed } //not blocked by me
    //show only profiles that I have shortlisted
    if(filters.shortlistedOnly)
    {
      if(myProfile && myProfile.shortlisted)
        conditions['_id'] = { $in: myProfile.shortlisted }
      else
        conditions['_id'] = { $in: [] }
    }
      
      
    if(filters.age)
    {
      conditions["basicInfo.dateOfBirth"] = { 
        $gte: moment().tz('GMT').subtract(filters.age[1], 'y'), 
        $lte: moment().tz('GMT').subtract(filters.age[0], 'y')
      }
    }
    if(filters.height) // preference saved as array index
      conditions["basicInfo.height"] = {  $gte: parseInt(filters.height[0]) + 1, $lte: parseInt(filters.height[1]) + 1 };
    ['maritalStatus', 'profileCreatedBy', 'bodyType', 'skinTone', 'disability'].forEach(item => {
      if(filters[item])
        conditions[`basicInfo.${item}`] = Array.isArray(filters[item]) ? {  $in: filters[item] } : filters[item];
    });
    
    if(filters.religion)
    {
      conditions["religionCaste.religion"] = {  $in: filters.religion }
      if(filters.community)
        conditions["religionCaste.community"] = {  $in: filters.community }
    }
    if(filters.motherTongue)
      conditions["religionCaste.motherTongue"] = {  $in: filters.motherTongue };
    //Family 
    ['familyType', 'familyValues', 'familyAffluence'].forEach(item => {
      if(filters[item])
        conditions[`family.${item}`] = Array.isArray(filters[item]) ? {  $in: filters[item] } : filters[item];
    });
    //Education & Career
    ['educationLevel', 'educationField', 'workingWith', 'workingAs'].forEach(item => {
      if(filters[item])
        conditions[`educationCareer.${item}`] = {  $in: filters[item] }
    });
    if(filters.annualIncome)
    {
      if(Array.isArray(filters.annualIncome))
        conditions["educationCareer.annualIncome"] = {  $in: filters.annualIncome };
      else
      {
       let annualIncome = {  $gte: filters.annualIncome, $lte: filters.noIncomeProfiles ? 13 : 12 }; //13=> don't want to specify, 12=>1 Crore plus
       if(filters.noIncomeProfiles)
        conditions["$or"] = [{ 'educationCareer.annualIncome': annualIncome}, {'educationCareer.annualIncome': {$exists: false}}];
       else
        conditions["educationCareer.annualIncome"] = annualIncome;
      }
    }
    //LifeStyle
    ['diet', 'drink', 'smoke'].forEach(item => {
      if(filters[item])
        conditions[`lifestyle.${item}`] = Array.isArray(filters[item]) ? {  $in: filters[item] } : parseInt(filters[item]);
    });
    //Location
    if(filters.country)
    {
      conditions["location.country"] = {  $in: filters.country }
      if(filters.state)
      {
        conditions["location.state.id"] = {  $in: filters.state }
        if(filters.city)
          conditions["location.city.id"] = {  $in: filters.city }
      }
    }
      
    
    if(filters.visibility)
      conditions["photos.visibility"] = filters.visibility;
    if(filters.activeWithin)
      conditions["lastActive"] = {$gte: moment().tz('GMT').subtract(filters.activeWithin, 'days')}
    if(filters.joinedWithin)
      conditions["joinedOn"] = {$gte: moment().tz('GMT').subtract(filters.joinedWithin, 'days')}
    if(filters.availableForChat)
      conditions["lastActive"] = {$gte: moment().tz('GMT').subtract(filters.availableForChat, "minutes")}
      
    const twoWayconditions = [];
    if(filters.twoWayMatch && myProfile)
    {
      const { basicInfo, religionCaste, location, educationCareer, lifestyle } = myProfile.toObject();
      const rangeCondtions = {
        age: basicInfo && basicInfo.dateOfBirth ? moment().tz('GMT').diff(moment(basicInfo.dateOfBirth).tz('GMT'), 'years') : 555,
        height: basicInfo && basicInfo.height ? basicInfo.height - 1 : 555
      };
      Object.keys(rangeCondtions).forEach(key => {
        twoWayconditions.push( { $or: [
          { [`partnerPreference.${key}`] : {$exists: false} },
          { [`partnerPreference.${key}.0`]: { $lte: rangeCondtions[key] }, [`partnerPreference.${key}.1`]: { $gte: rangeCondtions[key] } } 
          ]  
        });
      })
      const myValues = {};
      myValues.maritalStatus = basicInfo && basicInfo.maritalStatus ? basicInfo.maritalStatus : null;
      myValues.profileCreatedBy = basicInfo && basicInfo.profileCreatedBy ? basicInfo.profileCreatedBy : null;
      
      myValues.religion = religionCaste && religionCaste.religion ? religionCaste.religion : null;
      myValues.community = religionCaste && religionCaste.community ? religionCaste.community : null;
      myValues.motherTongue = religionCaste && religionCaste.motherTongue ? religionCaste.motherTongue : null;

      myValues.country = location && location.country ? location.country : null;
      myValues.state = location && location.state && location.state.id ? location.state.id : null;
      myValues.city = location && location.city && location.city.id ? location.city.id : null;

      myValues.educationLevel = educationCareer && educationCareer.educationLevel ? educationCareer.educationLevel : null;
      myValues.workingWith = educationCareer && educationCareer.workingWith ? educationCareer.workingWith : null;
      myValues.workingAs = educationCareer && educationCareer.workingAs ? educationCareer.workingAs : null;

      myValues.diet = lifestyle && lifestyle.diet ? lifestyle.diet : null;

      Object.keys(myValues).forEach(key => {
        twoWayconditions.push( { $or: [ 
          { [`partnerPreference.${key}`] : {$exists: false} }, // not set
          { [`partnerPreference.${key}`] : null }, //doesn't matter
          { [`partnerPreference.${key}`]: myValues[key] } //specified
          ]  
        });
      })
      const myIncome = educationCareer && educationCareer.annualIncome && educationCareer.annualIncome !== 13 ? educationCareer.annualIncome : null; //13 don't want to specify
      twoWayconditions.push( { $or: [ 
        { "partnerPreference.annualIncome" : {$exists: false} }, // not set
        { "partnerPreference.annualIncome" : "" }, //doesn't matter
        myIncome ? 
        { "partnerPreference.annualIncome": {$lte : myIncome} } //specified
        :
        { "partnerPreference.noIncomeProfiles": true }
        ]  
      });
    }

    // if multiple $or conditions change to $and
    if(conditions['$or'] && twoWayconditions.length)
    {
      conditions['$and'] = [ { $or: conditions['$or'] }, ...twoWayconditions ];
      delete conditions['$or'];
    }else if(twoWayconditions.length)
      conditions['$and'] = twoWayconditions;

    //res.json(conditions['$and']);
    const selectFields = {
      _id: 1,
      userId: 1,
      "basicInfo.firstName" : 1,
      "basicInfo.lastName" : 1,
      "basicInfo.gender" : 1,
      "basicInfo.dateOfBirth" : 1,
      "basicInfo.maritalStatus" : 1,
      "basicInfo.height" : 1,

      "religionCaste.religion" : 1,
      "religionCaste.community" : 1,
      "religionCaste.motherTongue" : 1,

      "location.country" : 1,
      "location.state" : 1,
      "location.city" : 1,

      "educationCareer.educationLevel" : 1,
      "educationCareer.educationField" : 1,
      "educationCareer.workingWith" : 1,
      "educationCareer.workingAs" : 1,
      "photos" : 1,
      "profileDescription": 1,
      "lastActive": 1,
      "joinedOn": 1,
      "lastUpdated": 1
    }
    const sortField = filters.sortBy ? filters.sortBy : 'lastUpdated';

    const paginationLimit = parseInt(process.env.PAGINATION_LIMIT);
    const pageNumber = filters.pageNumber ? parseInt(filters.pageNumber) - 1: 0;
    
    let profiles = await Profile.find(conditions, selectFields).sort({ [sortField]: -1 }).skip(pageNumber * paginationLimit).limit(paginationLimit);
    const total = await Profile.countDocuments(conditions);
    const currentTime = moment().tz('GMT').toDate();
    profiles = await Promise.all(profiles.map(async profile => {
      let user = await getProfileWithImageUrls(profile, myProfile); 
      user.currentTime = currentTime;
      return user;
    }));
    const response = {
      profiles,
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
