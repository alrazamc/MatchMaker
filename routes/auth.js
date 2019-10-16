const router = require('express').Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const bcrypt = require('bcryptjs');
const { createJwtToken } = require('../utils');
const passport  = require('passport');

router.post('/signup', (req, res) => {
  const required = ["password", "firstName", "lastName", "gender", "dateOfBirth"];
  for(let key in required)
    if(!req.body[ required[key] ])
      return res.json({error: required[key] + " is required"});
  const user = {};
  if(req.body.phoneNumber)
    user.phoneNumber = req.body.phoneNumber;
  else if(req.body.email)
    user.email = req.body.email;
  else
    return res.json({error: "Please provide either email or phone number"});
  User.findOne(user).then( result => {
    if(result === null) //doesn't exist
    {
      user.password = bcrypt.hashSync(req.body.password, 10);
      user.lastLoggedIn = new Date();
      new User(user).save().then(account => {
        new Profile({
          userId: account._id,
          basicInfo:{
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth
          }
        }).save().then( profile => {
          const newUser = {...account._doc};
          delete newUser.password; delete newUser.__v;
          res.json({
            user: newUser,
            token: createJwtToken(newUser)
          });
        }).catch(err => res.json({error: err.message}) ); //Profile save catch
      }).catch(err => res.json({error: err.message}) ); //User Save catch
    }else
    {
      req.body.phoneNumber ?
        res.json({error: "This number is already registered. Please use a different number"}) :
        res.json({error: "This email is already registered. Please use a different email address"});
    }
  }).catch(err => res.json({error: err.message}));
  
});

router.post('/signin', (req, res) => {
  if(!req.body.password)
    return res.json({error: "Password is required"});
  const user = {};
  if(req.body.phoneNumber)
    user.phoneNumber = req.body.phoneNumber;
  else if(req.body.email)
    user.email = req.body.email;
  else
    return res.json({error: "Please provide either email or phone number"});
  User.findOne(user).then(result => {
    if(result === null || !bcrypt.compareSync(req.body.password, result.password) )
      return res.json({error: "Invalid Phone/Email or Password"});
      const userData = {...result._doc};
      delete userData.password; delete userData.__v;
      result.updateLastLoggedIn().catch(err => res.json({error: err.message}));
      res.json({
        user: userData,
        token: createJwtToken(userData)
      });
  }).catch(err => res.json({error: err.message}));
});

//auth with google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
//handle redirect
router.get('/google/redirect', passport.authenticate('google', { session:false }), (req, res) => {
  res.send(createJwtToken(req.user));
});

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));
//handle redirect
router.get('/facebook/redirect', passport.authenticate('facebook', { session:false, failureRedirect: 'https://facebook.com' }), (req, res) => {
  res.send(createJwtToken(req.user));
});

module.exports = router;