const mongoose = require('mongoose');
const { exec } = require('child_process');
const path = require('path');

const TaskSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  args: [mongoose.Schema.Types.Mixed],
  status:{
    type: Number,
    default: 0
  },
  timeStamp: {
    type: Number,
    default: Date.now
  },
  failLog: String
});

//status
//0=pending
//1=processing
//2=Completed
//-1=Failed

TaskSchema.methods.saveAndRun = async function(){
  await this.save();
  if(process.env.NODE_ENV === "development")
  {
    let workerPath = path.resolve(process.cwd(), 'workers/worker.js');
    exec(`node ${workerPath}`);
  }
}

module.exports = mongoose.model('task', TaskSchema);