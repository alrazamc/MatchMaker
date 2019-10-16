const router = require('express').Router();
const { authCheck } = require('../utils/middlewares');
const User = require('../models/User');
const Profile = require('../models/Profile');

router.use(authCheck);

router.get('/profile', async (req, res) => {
    try
    {
      const profile = await Profile.findOne({ userId: req.user._id });
      res.json({
        user: req.user,
        profile: profile
      });
    }catch(err)
    {
      res.json({error: err.message});
    }
})

module.exports = router;