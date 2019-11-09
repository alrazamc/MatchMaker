const sharp = require('sharp');
const jimp = require('jimp');
const AWS = require('aws-sdk');
const fs = require('fs');
const util = require('util');
const Profile = require('../models/Profile');
const s3 = new AWS.S3();

const isExists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const deleteFile = util.promisify(fs.unlink);

const createDirIfNotExists = async (rootDir) => {
  const directories = ['', 'thumbs/', 'blurred/']
  for(let i=0; i<directories.length; i++)
  {
    let path = rootDir + directories[i];
    const isDirExists = await isExists(path);
    if(!isDirExists)
    await mkdir(path);
  }
}

const TEMP_IMAGES_DIR = './images/';

createDirIfNotExists(TEMP_IMAGES_DIR);

const downloadS3File = async (uid, fileName) => {
  return new Promise((resolve, reject) => {
    s3.getObject({Bucket: process.env.AWS_IMAGES_BUCKET, Key: `${uid}/${fileName}`}, async (err, data) => {
      try
      {
        if(err) reject(err);
        await writeFile(TEMP_IMAGES_DIR + fileName, data.Body);
        resolve(TEMP_IMAGES_DIR + fileName);
      }catch(err)
      {
        reject(err);
      }
    });
  });
}

const createThumbnail = async (uid, fileName) => {
  try
  {
    const imageFilePath =  await downloadS3File(uid, fileName);
    const isImageExists = await isExists(imageFilePath);
    if(!isImageExists) throw new Error("Image download failed");
    const thumbPath = TEMP_IMAGES_DIR + 'thumbs/' + fileName;
    await sharp(imageFilePath).resize(parseInt(process.env.THUMB_WIDTH)).toFile( thumbPath );
    const isThumbExists = await isExists(thumbPath);
    if(isThumbExists)
    {
      await uploadFileToS3(thumbPath, `${uid}/thumbs/${fileName}`);
      await deleteFile(thumbPath);
    }
    await deleteFile(imageFilePath);
  }catch(err)
  {
    console.log(err);
  }
}

const createBlurredImage = async (uid, fileName) => {
  try
  {
    const imageFilePath =  await downloadS3File(uid, 'thumbs/' + fileName);
    let isImageExists = await isExists(imageFilePath);
    if(!isImageExists) throw new Error("Image download failed");
    const blurredImagePath = TEMP_IMAGES_DIR + 'blurred/' + fileName;
    const image = await sharp(imageFilePath);
    const metaData = await image.metadata();
    const highestDim = metaData.width > metaData.height ? metaData.width :metaData.height;
    const sigma = highestDim ? Math.ceil(highestDim/41) : 69;
    await image.blur(sigma).toFile( blurredImagePath );
    await deleteFile(imageFilePath); //delete source image
    isImageExists = await isExists(blurredImagePath);
    if(!isImageExists) throw new Error("Blurred image not found");
    await uploadFileToS3(blurredImagePath, `${uid}/protected/${fileName}`);
  }catch(err)
  {
    console.log(err);
  }
}


const uploadFileToS3 = async (filePath, Key) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if(err) reject(err);
      let base64data = Buffer.from(data, 'binary');
      let params = {
        Bucket: process.env.AWS_IMAGES_BUCKET,
        Key,
        Body: base64data
      };
      s3.upload(params, (err, data) => {
        if(err) reject(err);
        resolve(data);
      });
    })
  });
}

const deleteS3Objects = (keys) => {
  const params = {
    Bucket: process.env.AWS_IMAGES_BUCKET, 
    Delete: { Objects: keys,  Quiet: false  }
  };
  return new Promise((resolve, reject) => {
    s3.deleteObjects(params, (err, data) => {
      if(err) reject(err);
      resolve(data);
    });
  });
}

const deleteProtectedImage = async (uid, fileName) => {
  const keys = [
    `${uid}/protected/${fileName}`
  ].map(Key => ({Key}));
  return await  deleteS3Objects(keys);
}

const updateProfileProtectedPhoto = async (profileId) => {
  const profileDoc = await Profile.findById(profileId);
  const profile = profileDoc.toObject();
  if(!profile.photos || !profile.photos.images || profile.photos.images.length === 0) return;
  let visibility = !profile.photos.visibility ? null : profile.photos.visibility;
  if(!visibility) return;
  let profilePicIndex = !profile.photos.profilePictureIndex ? 0 : profile.photos.profilePictureIndex;
  let image = profile.photos.images[profilePicIndex] ? profile.photos.images[profilePicIndex] : profile.photos.images[0] ;
  if(visibility === 2) //2=> protected
  {
    await createBlurredImage(profile.userId, image.fileName);
  }else if(visibility === 1) //1 = Photo setting is public
  {
    await deleteProtectedImage(profile.userId, image.fileName);
  }
}



module.exports = {
  createThumbnail,
  deleteS3Objects,
  deleteProtectedImage,
  updateProfileProtectedPhoto
};