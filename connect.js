const mongoose = require('mongoose');
const config = require('./config');

// eslint-disable-next-line no-unused-vars
const { dbUrl } = config;
function connect() {
  mongoose.connection.on('connected', () => console.log('mongo connected'));
  mongoose.connection.on('open', () => console.log('mongo open'));
  mongoose.connection.on('disconnected', () => console.log('mongo disconnected'));
  mongoose.connection.on('reconnected', () => console.log('mongo reconnected'));
  mongoose.connection.on('disconnecting', () => console.log('mongo disconnecting'));
  mongoose.connection.on('close', () => console.log('mongo close'));

  mongoose.connect(dbUrl);
}

module.exports = { connect };
