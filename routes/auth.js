//JWT é token p/ autenticação e troca de info em tempo real armazenar de forma segura e compacta obj JSON.

const jwt = require('jsonwebtoken');
const config = require('../config');

const { secret } = config;

module.exports = (app, nextMain) => {
  app.post('/login', (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    resp.sendStatus(200);
    // TODO: Authenticate the user
    // It is necessary to confirm if the email and password
    // match a user in the database
    // If they match, send an access token created with JWT

    next();
  });

  return nextMain();
};
