const Profile = require('../models/Profile');
const moment = require('moment-timezone');

const createDefaultProfile = async (userId, body={}) => {
  const profileDoc = {
    userId: userId,
    basicInfo:{
      firstName: body.firstName ? body.firstName : null,
      lastName: body.lastName ? body.lastName : null,
      gender: body.gender ? body.gender : null,
      dateOfBirth: body.dateOfBirth ? body.dateOfBirth : null,
    },
    // religionCaste: {},
    // family: {},
    // educationCareer: {},
    // lifestyle: {},
    // location: {},
    // partnerPreference: {},
    photos: {
      visibility:1,
      profilePictureIndex: 0,
      images: []
    },
    sentPhotos: [],
    searches: [],
    shortlisted: [],
    filtered: [],
    blocked: [],
    viewed: [],
    lastUpdated: moment().tz('GMT').toDate(),
    lastActive: moment().tz('GMT').toDate(),
    joinedOn: moment().tz('GMT').toDate()
  }
  return await new Profile(profileDoc).save();
}

module.exports = {
  createDefaultProfile
}