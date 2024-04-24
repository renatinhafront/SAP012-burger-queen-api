const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userRepository } = require('../repository');
const { secret } = require('../config');

module.exports = {
  login: async (req, resp) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).json({ error: 'Email ou senha não informado' });
    }

    // confere email
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!reg.test(email)) {
      // nao é um email valido, nao vale a pena perguntar se existe na DB
      return resp.status(400).json({ error: 'Email inválido' });
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
    // 15 segundos pra testar autenticação
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: 86400 });
    return resp.status(200).json({ auth: true, token });
  },
};
