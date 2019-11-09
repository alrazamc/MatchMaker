const User = require('../models/User');
const Profile = require('../models/Profile');
const ejs = require('ejs');
const striptags = require('striptags');
//init AWS SDK
const AWS = require('aws-sdk');
const Ses = new AWS.SES({ apiVersion: "2010-12-01" });
const EMAIL_TEMPLATES_PATH = __dirname + "/../views/emails/";

const sendResetPasswordEmail = async uid => {
  const user = await User.findById(uid);
  if(!user.get('email')) throw new Error("No email address found in database");
  const profile = await Profile.findOne({userId: user.id});
  const data = {
    code: Math.floor(100000 + Math.random() * 900000), //6 digit random code
    name: profile && profile.basicInfo && profile.basicInfo.firstName ? profile.basicInfo.firstName : ""
  }
  user.set('passwordResetCode', data.code);
  await user.save();
  const subject = "Reset Password";
  templateFileName = "resetPassword";
  return await sendEmail(user.get('email'), subject, templateFileName, data);
}

const parseTemplate = async (template, data) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(EMAIL_TEMPLATES_PATH + template + '.ejs', data, (err, str) => {
      if(err) reject(err);
      resolve(str);
    })
  })
}

const sendEmail = async (to, subject, template,  data) => {
  const htmlString = await parseTemplate(template, data);
  const params = {
    Destination: { ToAddresses: [to] },
    Message: {
      Body: {
        Html: {  Charset: "UTF-8", Data: htmlString },
        Text: {  Charset: "UTF-8", Data: striptags(htmlString) }
      },
      Subject: {  Charset: 'UTF-8', Data: subject  }
    },
    Source: process.env.FROM_EMAIL,
  };
  result = await Ses.sendEmail(params).promise();
  return result.MessageId;
}

module.exports = {
  sendResetPasswordEmail
}