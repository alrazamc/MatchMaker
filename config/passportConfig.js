const User = require('../models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const moment = require('moment-timezone');

const gStrategy = new GoogleStrategy({
  callbackURL: '/auth/google/redirect',
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
  const emailAddress = profile.emails && profile.emails.length ? profile.emails[0].value : null;
  let findCond = { googleId: profile.id };
  if(emailAddress)
    findCond = { $or: [{ googleId: profile.id }, { email: emailAddress }] }
  try
  {
    const currentUser = await User.findOne(findCond);
    if(currentUser)
    {
      if(!currentUser.googleId) currentUser.googleId = profile.id;
      if(emailAddress && !currentUser.email) currentUser.email = emailAddress;
      currentUser.lastLoggedIn = moment().tz('GMT').toDate();
      const user = await currentUser.save();
      done(null, user);
    }else
    {
      const user = { googleId: profile.id, lastLoggedIn: moment().tz('GMT').toDate() };
      if(emailAddress)
      {
        user.email = emailAddress;
        user.isEmailVerified = profile.emails[0].verified ? true : false ;
      }
      const newUser = await new User(user).save();
      done(null, newUser);
    }
  }catch(err)
  {
    done(err.message, null);
  }
});

passport.use(gStrategy);


const fStrategy = new FacebookStrategy({
  callbackURL: '/auth/facebook/redirect',
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  profileFields: ['id', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  const emailAddress = profile.emails && profile.emails.length ? profile.emails[0].value : null;
  let findCond = { facebookId: profile.id };
  if(emailAddress)
    findCond = { $or: [{ facebookId: profile.id }, { email: emailAddress }] }
  try
  {
    const currentUser = await User.findOne(findCond);
    if(currentUser)
    {
      if(!currentUser.facebookId) currentUser.facebookId = profile.id;
      if(emailAddress && !currentUser.email) currentUser.email = emailAddress;
      currentUser.lastLoggedIn = nmoment().tz('GMT').toDate();
      const user = await currentUser.save();
      done(null, user);
    }else
    {
      const user = { facebookId: profile.id, lastLoggedIn: moment().tz('GMT').toDate() };
      if(emailAddress)
      {
        user.email = emailAddress;
        user.isEmailVerified = profile.emails[0].verified ? true : false ;
      }
      const newUser = await new User(user).save();
      done(null, newUser);
    }
  }catch(err)
  {
    done(err.message, null);
  }
});

passport.use(fStrategy);
