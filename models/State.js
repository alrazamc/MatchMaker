const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  id:Number,
  title: String,
  country_id: Number
});

module.exports = mongoose.model('state', stateSchema);