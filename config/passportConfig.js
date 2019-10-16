const User = require('../models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const gStrategy = new GoogleStrategy({
  callbackURL: '/auth/google/redirect',
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
  const emailAddress = profile.emails && profile.emails.length ? profile.emails[0].value : null;
  let findCond = { googleId: profile.id };
  if(emailAddress)
    findCond = { $or: [{ googleId: profile.id }, { email: emailAddress }] }
  User.findOne(findCond).then((currentUser) => {
    if(currentUser)
    {
      if(!currentUser.googleId) currentUser.googleId = profile.id;
      if(emailAddress && !currentUser.email) currentUser.email = emailAddress;
      currentUser.lastLoggedIn = new Date();
      currentUser.save().then(result => done(null, result)).catch(err => done(null, currentUser));
    }else
    {
      const user = { googleId: profile.id, lastLoggedIn: new Date() };
      if(emailAddress)
      {
        user.email = emailAddress;
        user.isEmailVerified = profile.emails[0].verified ? true : false ;
      }
      new User(user).save().then(newUser => done(null, newUser) ).catch(err => done(err, null));
    }
  });
});

passport.use(gStrategy);


const fStrategy = new FacebookStrategy({
  callbackURL: '/auth/facebook/redirect',
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  profileFields: ['id', 'email']
}, (accessToken, refreshToken, profile, done) => {
  const emailAddress = profile.emails && profile.emails.length ? profile.emails[0].value : null;
  let findCond = { facebookId: profile.id };
  if(emailAddress)
    findCond = { $or: [{ facebookId: profile.id }, { email: emailAddress }] }
  User.findOne(findCond).then((currentUser) => {
    if(currentUser)
    {
      if(!currentUser.facebookId) currentUser.facebookId = profile.id;
      if(emailAddress && !currentUser.email) currentUser.email = emailAddress;
      currentUser.lastLoggedIn = new Date();
      currentUser.save().then(result => done(null, result)).catch(err => done(null, currentUser));
    }else
    {
      const user = { facebookId: profile.id, lastLoggedIn: new Date() };
      if(emailAddress)
      {
        user.email = emailAddress;
        user.isEmailVerified = profile.emails[0].verified ? true : false ;
      }
      new User(user).save().then(newUser => done(null, newUser) ).catch(err => done(err, null));
    }
  });
});

passport.use(fStrategy);
