const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber:{
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
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
  lastLoggedIn: Date
});

userSchema.methods.updateLastLoggedIn = function(){
  this.lastLoggedIn = new Date();
  return this.save();
}

module.exports = mongoose.model('users', userSchema);