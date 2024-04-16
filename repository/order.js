const { default: mongoose } = require('mongoose');
const mongodb = require('../connect');
const userSchema = require('../schema/user');

const users = 'users';
async function findAll() {
  const db = await mongodb.connect();

  return db.collection(users).find({}).toArray();
}

async function findByID(id) {
  const userModel = mongoose.model('User', userSchema);
  return userModel.findById({ id });
}

async function findByEmail(email) {
  const userModel = mongoose.model('User', userSchema);
  return userModel.findOne({ email });
}

async function create(user) {
  const userModel = mongoose.model('User', userSchema);
  return userModel.create(user);
}

module.exports = {
  findAll,
  findByEmail,
  findByID,
  create,
};
