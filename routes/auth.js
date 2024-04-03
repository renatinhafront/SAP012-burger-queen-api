//JWT token autenticação e troca de info em tempo real armazenar de forma segura e compacta obj JSON.

const jwt = require('jsonwebtoken');
const config = require('../config');
const dbUsers = require('../repository/user');

const { secret } = config;

module.exports = (app, nextMain) => {
  app.post('/login', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email) {
      return resp.status(400).json({ error: 'Email não informado' });
    }

    if (!password) {
      return resp.status(400).json({ error: 'Senha não informado' });
    }

    // confere user existente no banco
    const user = await dbUsers.findByEmail(email);

    if (!user) {
      return resp.status(404).json({ error: 'Usuario não encontrado' });
    }

    // confere se é user admin
    if (user.roles !== 'admin') {
      return resp.status(401).json({ error: 'Usuario não é admin' });
    }

    // confere password
    // const salt =  bcrypt.genSalt(10);
    if (!bcrypt.compareSync(password, user.password)) {
      return resp.status(401).json({ error: 'Senha invalida' });
    }

    // const passwordHash =  bcrypt.hash(password, salt);

    const token = jwt.sign({ email }, secret, { expiresIn: 300 });

    resp.status(200).json({ auth: true, token });

    // TODO: Authenticate the user
    // It is necessary to confirm if the email and password
    // match a user in the database
    // If they match, send an access token created with JWT

    next();
  });

  return nextMain();
};
