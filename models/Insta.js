const mongoose = require('mongoose');

var InstaSchema = new mongoose.Schema({
  token: {
    type: String
  },
  timestamp: {
    type: String
  },
  url: {
    type: String
  },
  tag: {
    type: String
  }
});

if (process.env.IS_OFFLINE) {
  delete mongoose.connection.models.Insta;
}

module.exports = mongoose.model('Insta', InstaSchema);
