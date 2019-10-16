const mongoose = require('mongoose');

const basicInfoSchema = new mongoose.Schema({
  firstName:String,
  lastName: String,
  profileCreatedBy: Number,
  gender: Number,
  dateOfBirth: Date,
  maritalStatus: Number,
  height: Number,
  bodyType: Number,
  bodyWeight: Number,
  healthInfo: Number,
  healthInfoText: String,
  skinTone: Number,
  disability: Number,
  bloodGroup: Number
});

const profileSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Profile userId is required"]
  },
  basicInfo: basicInfoSchema
});

module.exports = mongoose.model('profiles', profileSchema);