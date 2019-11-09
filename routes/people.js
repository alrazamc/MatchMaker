const router = require('express').Router();
const { authCheck, loadProfile } =  require('../utils/middlewares');
const Profile = require('../models/Profile');

router.use(authCheck);
router.use(loadProfile);

router.post('/doAction', async(req, res) => {
  try
  {
    if(!req.body.personID)
      throw new Error('ID is required');
    if(!req.body.listName)
      throw new Error('List name is required');
    let updateData = { $push: { [req.body.listName]: {
      $each: [req.body.personID],
      $position: 0
    } } };
    response = await Profile.updateOne({_id: req.profile.id}, updateData, {runValidators: true});
    res.json({ success: true});
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
})

router.post('/undoAction', async(req, res) => {
  try
  {
    if(!req.body.personID)
      throw new Error('ID is required');
    if(!req.body.listName)
      throw new Error('List name is required');
    let updateData = { $pull: { [req.body.listName]: req.body.personID } };
    response = await Profile.updateOne({_id: req.profile.id}, updateData, {runValidators: true});
    res.json({ success: true});
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
})

module.exports = router;