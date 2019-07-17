const express = require('express');
const bodyParser = require('body-parser');
const defaults = require('./config/defaults');
const instagram = require('./routes/util/instagram');
const db = require('./config/mongoose');
const app = express();
const InstaModel = require('./models/Insta');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/static'));

const uri =
  'mongodb+srv://dbuser:dbpassword@cluster0-gmvnt.mongodb.net/test?retryWrites=true&w=majority';

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  try {
    await db.getConnection();
  } catch (error) {
    console.error(`FATAL`, JSON.stringify(error, null, 2));
  }
  res.render('index.ejs');
});

app.get('/lista', async (req, res) => {
  try {
    await db.getConnection();
  } catch (error) {
    console.error(`FATAL`, JSON.stringify(error, null, 2));
  }
  var find = await InstaModel.find().sort({ _id: -1 }).limit(20);
  res.json(find);
});

app.get('/tag/:tag', async function(req, res, next) {
  const _limit = req.query.limit
    ? req.query.limit
    : defaults.INSTAGRAM_DEFAULT_FIRST;
  const _recent = req.query.recent ? req.query.recent === '1' : false;
  const _hashtag = req.params.tag;

  try {
    await db.getConnection();
  } catch (error) {
    console.error(`FATAL`, JSON.stringify(error, null, 2));
  }

  const arr = await instagram(_hashtag, 30, true);
  for (var i = 0, len = arr.length; i < len; i++) {
    var query = { token: arr[i].id };
    var find = await InstaModel.findOne(query);
    if (!find) {
      let result = new InstaModel();
      result.token = arr[i].id;
      result.url = arr[i].image;
      result.tag = _hashtag;
      result.username = arr[i].owner.username;
      result.timestamp = arr[i].timestamp;
      await result.save();
    }
  }
  res.json(arr);
});
