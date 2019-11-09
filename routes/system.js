const router = require('express').Router();
const System = require('../models/System');
const State = require('../models/State');
const City = require('../models/City');

router.post('/', async (req, res) => {
  const names = req.body.names ? req.body.names : [];
  const conditions = {};
  if(names.length)
    conditions.name = { $in: names };
  try{
    const results = await System.find(conditions);
    res.json({
      version: process.env.SYSTEM_VERSION,
      results
    });
  }catch(err)
  {
    res.status(400).json({ message: err.message })
  }
});

router.get('/states', async (req, res) => {
  let conditions = {};
  if(req.query.countryId)
    conditions = { country_id: req.query.countryId };
  else if(req.query.ids)
    conditions = { country_id: { $in : req.query.ids } };
  try{
    const result = await State.find(conditions);
    res.json(result);
  }catch(err)
  {
    res.status(400).json({ message: err.message })
  }
});

router.get('/cities', async (req, res) => {
  let conditions = {};
  if(req.query.stateId)
    conditions = { state_id: req.query.stateId };
  else if(req.query.ids)
    conditions = { state_id: { $in : req.query.ids } };
  try{
    const result = await City.find(conditions);
    res.json(result);
  }catch(err)
  {
    res.status(400).json({ message: err.message })
  }
});

module.exports = router;