const { login } = require('../controller/auth');

module.exports = (app, next) => {
  app.post('/login', login);

  next();
};
