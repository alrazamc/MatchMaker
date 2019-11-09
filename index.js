process.env.NODE_ENV !== 'production' && require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./config/passportConfig');
const passport  = require('passport');
const path = require('path');
//init AWS SDK
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey:process.env.AWS_SECRET,
  region: process.env.AWS_REGION
});

const mongooseConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true  
}
mongoose.connect(process.env.MONGODB_URI, mongooseConfig)
.then( () => {
  console.log("database connected");
} 
).catch((err) => console.log(err.message));


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
//app.use((req, res, next) => setTimeout(next, 800));
app.use(express.static( path.join(__dirname, '/client/build') ));
app.use('/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/system', require('./routes/system'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/search', require('./routes/search'));
app.use('/api/people', require('./routes/people'));
app.use('/api/report', require('./routes/report'));
app.use('/api/request', require('./routes/request'));

//app.set('view engine', 'ejs');
const ejs = require('ejs');
app.get('/test', (req, res) => {
  ejs.renderFile('./views/emails/resetPassword.ejs', {code: 132843, name: "Ali"}, (err, str) => {
    res.send(str);
  });
  //res.render('emails/resetPassword', );
});

app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '/client/build/index.html')
  )
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening at ${PORT}`));