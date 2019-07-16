const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let isConnected;

module.exports.getConnection = () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }
  console.log('=> using new database connection');
  /*
   *  Adicionado useNewUrlParser para as novas versoes do MongoDB
   * - DeprecationWarning:
   *  current URL string parser is deprecated, and will be
   *  removed in a future version
   */
  return mongoose
    .connect(
      'mongodb+srv://dbuser:dbpassword@cluster0-gmvnt.mongodb.net/test?retryWrites=true&w=majority',
      {
        useNewUrlParser: true
      }
    )
    .then(db => {
      console.log('=> connection success');
      isConnected = db.connections[0].readyState;
    })
    .catch(error => {
      console.error(error);
    });
};

module.exports.destroyConnection = () => {
  if (isConnected) {
    mongoose.disconnect().then(() => {
      console.log('=> disconnect success');
      isConnected = false;
    });
  }
};
