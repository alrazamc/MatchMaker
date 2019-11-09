const router = require('express').Router();
const { authCheck, loadProfile } = require('../utils/middlewares');
const Profile = require('../models/Profile');
const Task = require('../models/Task');
const { getS3ImageUrl } = require('../utils/');
const AWS = require('aws-sdk');
const moment = require("moment-timezone");
const mongoose = require('mongoose');

router.use(authCheck);
router.use(loadProfile);

//Update different areas of profile
router.post('/', async (req, res) => {
  try
  {
    const [ info, ...rest] = Object.keys(req.body.payload);
    const update = {
      lastUpdated: moment().tz('GMT').toDate(),
      [info]: req.body.payload[info]
    }
    response = await Profile.updateOne({_id: req.profile.id}, update, {runValidators : true});
    if(info === "photos.profilePictureIndex" && req.profile.photos.visibility === 2) 
    {
      //profile pic changed on protected settings, delete old protected version
      let profilePicIndex = !req.profile.photos.profilePictureIndex ? 0 : req.profile.photos.profilePictureIndex;
      if(req.profile.photos.images[profilePicIndex])
        await new Task({userId: req.user._id, name: 'deleteProtectedImage', args: [req.user._id, req.profile.photos.images[profilePicIndex].fileName]  }).saveAndRun();
    }
    if(info === "photos.visibility" || (info === "photos.profilePictureIndex" && req.profile.photos.visibility === 2))
    {
      await new Task({userId: req.user._id, name: "updateProfileProtectedPhoto", args: [req.profile.id]}).saveAndRun();
    } 
    res.json({ success: true });
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
});

//get Signed Urls for file names to upload direct to S3
router.post('/photos/upload', async (req, res) => {
  try
  {
    if(!req.body.files || req.body.files.length === 0)
      throw new Error("Files are required");
    if(req.profile && req.profile.photos && req.profile.photos.images && req.profile.photos.images.length >= process.env.PHOTO_LIMIT)
      throw new Error("Please delete some photos to add more");
    req.body.files.forEach(file => {
      if(!file.fileName || file.fileName.length > 20 || !file.fileName.toLowerCase().match(/\.(jpg|jpeg|png|bmp|gif)$/i))
      throw new Error("Invalid File types");
    });
    const s3 = new AWS.S3();
    const response = await Promise.all(
        req.body.files.map(async file => {
        let params = {
          Bucket: process.env.AWS_IMAGES_BUCKET, 
          Key: `${req.user._id}/${file.fileName}`,
          ContentType: file.type
        };
        return {
          fileName: file.fileName,
          putUrl: await s3.getSignedUrlPromise('putObject', params)
        };
      })
    );
    res.json(response);
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
});

//Save filename in db After successfull upload to S3 from client
router.post('/photos/add', async (req, res) => {
  try
  {
    if(!req.body.fileName)
      throw new Error("File name is required");
    const image = {
      fileName: req.body.fileName,
      approved: true
    }
    let updateData = { lastUpdated: moment().tz('GMT').toDate(), $push: { 'photos.images': image } };
    response = await Profile.updateOne({_id: req.profile.id}, updateData, {runValidators: true});
    await new Task({userId: req.user._id,  name: "createThumbnail", args: [req.user._id, req.body.fileName] }).saveAndRun();
    image.imageUrl = await getS3ImageUrl(req.user._id, image.fileName);
    if(req.profile.photos && req.profile.photos.visibility === 2 &&
      ( !req.profile.photos.images || req.profile.photos.images.length === 0)) 
    {//first photo upload and visibility was protected, will be used as default profile pic so create protected version
      await new Task({userId: req.user._id,  name: "updateProfileProtectedPhoto", args: [req.profile.id] }).saveAndRun();
    }
    res.json({ success: true, image: image});
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
});

//delete file from s3 and db
router.post('/photos/remove', async(req, res) => {
  try
  {
    if(!req.body.fileName)
      throw new Error("File name is required");
    updateData = { lastUpdated: moment().tz('GMT').toDate(), $pull: { 'photos.images': {fileName: req.body.fileName} } };
    await Profile.updateOne({_id: req.profile.id}, updateData, {runValidators: true});
    const keys = [
      `${req.user._id}/${req.body.fileName}`,
      `${req.user._id}/thumbs/${req.body.fileName}`,
      `${req.user._id}/protected/${req.body.fileName}`
    ].map(Key => ({Key}));
    await new Task({userId: req.user._id,  name: "deleteS3Objects", args: [keys] }).saveAndRun();
    res.json({ success: true});
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
});

//Update Last active
router.post('/active', async(req, res) => {
  try
  {
    const time = moment().tz('GMT').toDate();
    await Profile.updateOne({_id: req.profile.id}, { lastActive: time }, {runValidators: true});
    res.json({ success: true, time});
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
});

router.post('/addSearch', async(req, res) => {
  try
  {
    if(!req.body.values)
      throw new Error("Values required")
    const id = mongoose.Types.ObjectId();
    req.body.values._id = id;
    const data = {$push: { 'searches': req.body.values }} 
    await Profile.updateOne({_id: req.profile._id}, data, {runValidators: true});
    res.json({id: id.toString()})
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
})

router.post('/updateSearch', async(req, res) => {
  try
  {
    if(!req.body.values)
      throw new Error("Values required")
    const id = req.body.values._id;
    let updateData = { $pull: { 'searches': {_id: id} } };
    await Profile.updateOne({_id: req.profile.id}, updateData, {runValidators: true});
    const searchIndex = req.profile.searches.findIndex(item => item._id.toString() === id)
    delete req.body.values.gender;
    delete req.body.values.profileId;
    if(!req.body.values.searchName)
      req.body.values.searchName = req.profile.searches[searchIndex].searchName;
    updateData = { $push: { searches: {
      $each: [req.body.values],
      $position: searchIndex
    } } };
    await Profile.updateOne({_id: req.profile._id}, updateData, {runValidators: true});
    res.json({id})
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
})

router.post('/deleteSearch', async(req, res) => {
  try
  {
    if(!req.body.searchId)
      throw new Error("Id is required")
    updateData = { $pull: { 'searches': {_id: req.body.searchId} } };
    await Profile.updateOne({_id: req.profile.id}, updateData, {runValidators: true});
    res.json({success: true})
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
})



module.exports = router;