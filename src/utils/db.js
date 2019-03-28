const mongoose = require('mongoose');

const connect = (url = process.env.DB_URL, opts = {}) =>
  mongoose.connect(url, {
    ...opts,
    useNewUrlParser: true,
    useCreateIndex: true,
  });

module.exports = {
  connect,
};
