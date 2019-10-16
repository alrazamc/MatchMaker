process.env.NODE_ENV !== 'production' && require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./config/passportConfig');
const passport  = require('passport');

const mongooseConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true  
}
mongoose.connect(process.env.MONGODB_URI, mongooseConfig)
.then( () => console.log("Database connected")).catch((err) => console.log(err.message));


const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

app.get('/', (req, res) => {
  res.json({
    type: 'ali'
  })
})


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening at ${PORT}`));