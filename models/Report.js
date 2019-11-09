const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  profileId: mongoose.Schema.Types.ObjectId,
  reportedProfileId: mongoose.Schema.Types.ObjectId,
  description: String,
  status: Number,
  timeStamp: Date,
});

//1=Pending
//2=Processing
//3=completed
module.exports = mongoose.model('report', reportSchema)