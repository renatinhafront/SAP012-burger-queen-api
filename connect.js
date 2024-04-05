const mongoose = require('mongoose');
const config = require('./config');

// eslint-disable-next-line no-unused-vars
const { dbUrl } = config;
function connect() {
  mongoose.connection.on('connected', () => console.log('Mongo connected'));
  mongoose.connection.on('open', () => console.log('Mongo open'));
  mongoose.connection.on('disconnected', () => console.log('Mongo disconnected'));
  mongoose.connection.on('reconnected', () => console.log('Mongo reconnected'));
  mongoose.connection.on('disconnecting', () => console.log('Mongo disconnecting'));
  mongoose.connection.on('close', () => console.log('Mongo close'));

  mongoose.connect(dbUrl);
}

module.exports = { connect };
