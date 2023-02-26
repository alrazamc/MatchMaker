const mongoose = require('mongoose');
const moment = require('moment-timezone');

const NotificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profiles'
  },
  to: mongoose.Schema.Types.ObjectId,
  time: mongoose.Schema.Types.Date,
  isSeen: Boolean,
  type: Number,
  payload: mongoose.Schema.Types.Mixed
})

const Notification = mongoose.model('notification', NotificationSchema);
const notificationTypes = {
  NEW_CONNECT_REQUEST: 1,
  NEW_PHOTO_REQUEST: 2,
  CONNECT_REQUEST_CANCELLED: 3,
  PHOTO_REQUEST_CANCELLED: 4,
  CONNECT_REQUEST_ACCEPTED: 5,
  PHOTO_REQUEST_ACCEPTED: 6,
  CONNECT_REQUEST_DECLINED: 7,
  PHOTO_REQUEST_DECLINED: 8,
  PROFILE_VIEWED: 9,
  PROFILE_SHORTLISTED: 10,
  PROFILE_BLOCKED: 11,
  PROFILE_UNBLOCKED: 12
}


const createNotification = async (fromProfileId, toProfileId, type, payload=null) => {
  await new Notification({
    from: fromProfileId,
    to: toProfileId,
    time: moment().tz('GMT').toDate(),
    isSeen: false,
    type,
    payload
  }).save();
}

const deleteNotification = async (fromProfileId, toProfileId, type) => {
  await Notification.findOneAndDelete({
    from: fromProfileId,
    to: toProfileId,
    type
  });
}

module.exports = {
  Notification,
  notificationTypes,
  createNotification,
  deleteNotification
};