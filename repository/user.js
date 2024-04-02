const mongodb = require('../connect');

const users = 'users';
async function findAll() {
  const db = await mongodb.connect();
  return db.collection(users).find({}).toArray();
}

async function findByEmail(email) {
  const query = { email };
  const db = await mongodb.connect();
  return db.collection(users).findOne(query);
}

async function create(user) {
  const db = await mongodb.connect();
  return db.collection(users).insertOne(user);
}

module.exports = {
  findAll,
  findByEmail,
  create,
};
