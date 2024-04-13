const jwt = require('jsonwebtoken');
const { userRepository } = require('../repository');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');
  // console.log(token);

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      console.error(err);
      return next(403);
    }

    // Verifica se o token foi decodificado
    if (!decodedToken) {
      return next(403);
    }

    // Verifica se o token tem o uid
    if (!decodedToken.uid) {
      return next(403);
    }

    // Consulta usuario no banco pelo id
    const user = await userRepository.findByID(decodedToken.uid);

    // Verifica se o user existe
    if (!user) {
      return resp.status(404).json({ error: 'Usuário não encontrado.' });
    }

    req.decodedToken = decodedToken;
    req.role = user.role;

    next();
  });
};

module.exports.isAuthenticated = (req) => {
  // Consulta a data de expiração do token
  if (!req.decodedToken) {
    return false;
  }

  const horaAtual = Math.floor(Date.now() / 1000); // em segundos
  if (req.decodedToken.exp > horaAtual) {
    console.log('Estou autenticando');
    return true;
  }

  return false;
};

module.exports.isAdmin = (req) => (
  // verifica se o role do usuario e admin
  req.role === 'admin'
);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
