// JWT token autenticação e troca de info em tempo real
// Usado para armazenar de forma segura e compacta obj JSON.

const { login } = require('../controller/auth');

module.exports = (app) => {
  app.post('/login', login);
};
