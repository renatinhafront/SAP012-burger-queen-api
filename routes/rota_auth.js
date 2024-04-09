// JWT token autenticação e troca de info em tempo real
// Usado para armazenar de forma segura e compacta obj JSON.

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { userRepository } = require('../repository');

const { secret } = config;

module.exports = (app, nextMain) => {
  app.post('/login', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email) {
      return resp.status(400).json({ error: 'Email não informado' });
    }

    if (!password) {
      return resp.status(400).json({ error: 'Senha não informada' });
    }

    // confere email
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!reg.test(email)) {
      // nao é um email valido, nao vale a pena perguntar se existe na DB
      return resp.status(400).json({ error: 'Email invalido' });
    }

    // confere user e password existente no banco
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return resp.status(404).json({ error: 'Usuário não encontrado.' });
    }
    // Verifica se a senha fornecida corresponde à senha armazenada no banco de dados
    if (!await bcrypt.compare(password, user.password)) {
      return resp.status(403).json({ error: 'Senha incorreta.' });
    }

    // Cria o token
    const token = jwt.sign({ uid: user._id }, secret, { expiresIn: 86400 });
    resp.status(200).json({ auth: true, token });

    // TODO: Authenticate the user
    // It is necessary to confirm if the email and password
    // match a user in the database
    // If they match, send an access token created with JWT

    next();
  });

  return nextMain();
};
