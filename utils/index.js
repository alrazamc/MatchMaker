const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const moment = require('moment-timezone');

const createJwtToken = (user, expire_in_hours = 5 * 365 * 24) => {
  const payload = {
    uid: user._id, 
    alg: 'RS256',
    iss: process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL,
    sub: process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL,
    aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
    iat: moment().unix(),
    exp: moment().add(expire_in_hours*60, 'minutes').unix(),
    claims: {
      phoneNumber: user.phoneNumber,
      email: user.email,
    }
  }
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SIGN_KEY, {algorithm : 'RS256'}, (err, token) => {
      if(err) reject(err);
      resolve(token);
    });
  })
}

const getPopupHtml = (token, fbtoken) => {
  return `<!DOCTYPE html><html><head><script>
      localStorage.setItem('${process.env.LOCAL_STORAGE_JWT_TOKEN_KEY}', '${token}');
      localStorage.setItem('${process.env.LOCAL_STORAGE_FB_TOKEN_KEY}', '${fbtoken}');
      if(window.opener && window.opener.loadAuth)
        window.opener.loadAuth();
      window.close();
    </script></head> <body></body> </html>`;
}
//Social Login failed
const getFailedLoginHtml = msg => {
  return `<!DOCTYPE html><html><head><script>
      if(window.opener && window.opener.loadAuth)
        window.opener.logOut('${msg}');
      window.close();
    </script></head> <body></body> </html>`;
}

const getS3ImageUrl = (uid, filePath, s3Instance=null) => {
  const s3 = s3Instance ? s3Instance : new AWS.S3();
  return s3.getSignedUrlPromise('getObject', {
    Bucket: process.env.AWS_IMAGES_BUCKET, 
    Key: `${uid}/${filePath}`,
    Expires: process.env.AWS_SIGNED_URL_EXPIRY_HOURS * 60 * 60 // N hours * 60 mins * 60 seconds
  });
}

const getProfileWithImageUrls = async (profile, myProfile=null) => {
  if(!profile) return profile;
  profile = profile.toObject();
  if(!profile.photos)
  {
    profile.photos = {
      images: []
    };
    return profile;
  }else if(!profile.photos.images)
  {
    profile.photos['images'] = [];
    return profile;
  }
  let images = profile.photos.images;
  if(images.length === 0) return profile;
  //Myprofile = profile of logged in user, show only approved images of other profiles
  const s3Instance = new AWS.S3();
  const visibility = profile.photos.visibility ? profile.photos.visibility : 0;
  if(myProfile && visibility === 2)//show only protected image of other user
  {
    const profilePictureIndex = profile.photos.profilePictureIndex ? profile.photos.profilePictureIndex : 0;
    const image = images[profilePictureIndex] ? images[profilePictureIndex] : images[0];
    try{
      if(image.approved === false) throw new Error("Not approved");
      profile.photos.images = [{
        thumbUrl: await getS3ImageUrl(profile.userId, 'protected/' + image.fileName, s3Instance)
      }]
    }catch(err)
    {
      console.log(err.message);
      profile.photos.images = [];
    }
    return profile;
  }

  if(myProfile) //show only approved images of other user
    images = images.filter(image => image.approved === true);
  if(images.length)
    profile.photos.images = await Promise.all(images.map(async image => {
      try{
        let imageUrl = await getS3ImageUrl(profile.userId, image.fileName, s3Instance);
        let thumbUrl = await getS3ImageUrl(profile.userId, 'thumbs/' + image.fileName, s3Instance);
        return { ...image, imageUrl, thumbUrl }
      }catch(err)
      {
        return { ...image, imageUrl:'', thumbUrl: '' }
      }
      ;
    }));
  else
    profile.photos.images = [];
  return profile;
}


const createAuthUser = user => {
  if(user.password)
    user.hasPassword = true;
  const deleteFields = ['password', '_v'];
  deleteFields.forEach(key => delete user[key]);
  return user;
}


module.exports = { 
  createJwtToken, 
  getPopupHtml, 
  getFailedLoginHtml, 
  getS3ImageUrl, 
  getProfileWithImageUrls, 
  createAuthUser
};