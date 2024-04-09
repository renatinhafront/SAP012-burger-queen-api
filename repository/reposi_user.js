const { default: mongoose } = require('mongoose');
const userSchema = require('../schema/user');

async function findAll() {
  const userModel = mongoose.model('User', userSchema);
  return userModel.find({}).select('-password');
}

async function findByID(id) {
  const userModel = mongoose.model('User', userSchema);
  return userModel.findById(id, '-password');
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
