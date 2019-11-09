const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  from: mongoose.Schema.Types.ObjectId,
  to: mongoose.Schema.Types.ObjectId,
  type: Number,
  status: Number,
  requestTime: Date,
  lastUpdated: Date
});

//type=1=Connect request
//type=2=Photo Request

//status=0=Cancelled
//status=1=Pending
//status=2=Accepted
//status=3=Declined

module.exports = mongoose.model('request', requestSchema);