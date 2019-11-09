process.env.NODE_ENV !== 'production' && require('dotenv').config({path: '../.env' });
const mongoose = require('mongoose');
const Task = require('../models/Task');
//init AWS SDK
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey:process.env.AWS_SECRET,
  region: process.env.AWS_REGION
});

const imageWorkers = require('./imageWorker');
const emailWorkers = require('./emailWorker');
const workers = {...imageWorkers, ...emailWorkers};

//init MongoDB
const mongooseConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true  
}
mongoose.connect(process.env.MONGODB_URI, mongooseConfig)
.then( () => {
  console.log("database connected");
  processTasks();
} 
).catch((err) => console.log(err.message));


const processTasks = async () => {
  const tasks = await Task.find({ 'status' : 0 }, null, {sort : { timeStamp: 1}} ); //0=> Pending task
  if(tasks.length === 0) return process.exit();
  const taskIds = tasks.map(task => task.id);
  await Task.updateMany({ '_id' : {$in: taskIds} }, { 'status' : 1 }); //get Lock on tasks => set status to processing
  console.log("Processing " + tasks.length + " task(s)");
  for(let i=0; i<tasks.length; i++)
  {
    let task = tasks[i];
    const worker = task.get('name');
    const args = task.get('args');
    try
    {
      if(!workers[worker])
        throw new Error('Invalid name, worker function not found');
      await workers[worker](...args);
      await task.set('status', 2).save(); //set status to Completed
    }catch(err)
    {
      task.set('status', -1);//status failed
      task.set('failLog', err.message);
      await task.save();
    }
  }
  processTasks();
}