const mongoose = require('mongoose');
const config = require('./config');

// eslint-disable-next-line no-unused-vars
const { dbUrl } = config;
function connect() {
  mongoose.connection.on('connected', () => console.info('Mongo connected'));
  mongoose.connection.on('open', () => console.info('Mongo open'));
  mongoose.connection.on('disconnected', () => console.info('Mongo disconnected'));
  mongoose.connection.on('reconnected', () => console.info('Mongo reconnected'));
  mongoose.connection.on('disconnecting', () => console.info('Mongo disconnecting'));
  mongoose.connection.on('close', () => console.info('Mongo close'));

  mongoose.connect(dbUrl);
}

module.exports = { connect };
