const express = require('express');
const router = express.Router();
const instagram = require('./util/instagram');
const defaults = require('./../config/defaults');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/:tag', async function(req, res, next) {
  const _limit = req.query.limit
    ? req.query.limit
    : defaults.INSTAGRAM_DEFAULT_FIRST;
  const _recent = req.query.recent ? req.query.recent === '1' : false;
  const _hashtag = req.params.tag;

  console.log('Tag ' + _hashtag);
  console.log('Record Limit ' + _limit);
  console.log('Recent records ' + _recent);

  const result = await instagram(_hashtag, _limit, _recent);
  console.log(result);
});

module.exports = router;
