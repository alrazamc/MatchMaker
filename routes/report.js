const router = require('express').Router();
const { authCheck, loadProfile } =  require('../utils/middlewares');
const Report = require('../models/Report');
const moment = require('moment-timezone');

router.use(authCheck);
router.use(loadProfile);

router.post('/', async(req, res) => {
  try
  {
    if(!req.body.reportedProfileId)
      throw new Error('ID is required');
    if(!req.body.description)
      throw new Error('Description is required');
    await new Report({
      profileId: req.profile._id,
      reportedProfileId: req.body.reportedProfileId,
      description: req.body.description,
      status: 1,
      timeStamp: moment().tz('GMT').toDate()
    }).save();
    res.json({ success: true});
  }catch(err)
  {
    res.status(400).json({message: err.message});
  }
})

module.exports = router;