const mongoose = require('mongoose');
const moment = require("moment-timezone");

const AccountStatusSchema = new mongoose.Schema({
  hidden: {
    type: Boolean,
    default: false
  },
  hiddenOn: mongoose.Schema.Types.Date,
  activateProfileOn: mongoose.Schema.Types.Date,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedOn: mongoose.Schema.Types.Date,
  deleteReason: Number,
  deleteReasonText: String,
  suspended: {
    type: Boolean,
    default: false
  },
  suspendedOn: mongoose.Schema.Types.Date,
  suspendReason: mongoose.Schema.Types.Mixed,
})

const userSchema = new mongoose.Schema({
  phoneNumber:{
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10,11}$/.test(v);
      },
      message: "Mobile number should be 10 digits like 3141234567"
    },
    required: [function() {
      return !this.email && !this.phoneNumber && !this.googleId && !this.facebookId
    }, "Please provide either email or phone number"]
  },
  countryCode: {
    type: String,
    default: '+92'
  },
  isPhoneVerified:{
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Invalid Email address"
    },
    required: [function() {
      return !this.email && !this.phoneNumber && !this.googleId && !this.facebookId
    }, "Please provide either email or phone number"]
  },
  isEmailVerified:{
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: [function() {
      return (!this.googleId && !this.facebookId) && (this.email || this.phoneNumber) && !this.password
    }, "Password is required"]
  },
  googleId: String,
  facebookId: String,
  lastLoggedIn: Date,
  status: {
    type: AccountStatusSchema,
    default: {}
  },
  passwordResetCode: Number
});

userSchema.methods.updateLastLoggedIn = function(){
  this.lastLoggedIn = moment().tz('GMT').toDate();
  return this.save();
}

module.exports = mongoose.model('users', userSchema);