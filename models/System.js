const mongoose = require('mongoose');

const systemSchema = new mongoose.Schema({
  type:String,
  name: String,
  choices:[{
    id: Number,
    religion: Number,
    labelCm: String,
    labelSymbol: String,
    labelUnit: String,
    value: Number,
    title: String
  }]
}, { collection: 'system' });



module.exports = mongoose.model('system', systemSchema);