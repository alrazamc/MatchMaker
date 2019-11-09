const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  id:Number,
  title: String,
  state_id: Number
});

module.exports = mongoose.model('city', citySchema);