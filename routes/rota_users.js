const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const { userRepository } = require('../repository');

const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getUsers, getUsersById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controller/users');

const initAdminUser = (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  if (!adminEmail || !adminPassword) {
    return next();
  }

  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    role: 'admin',
  };

  userRepository.findByEmail(adminEmail)
    .then((user) => {
      if (!user) {
        userRepository.create(adminUser)
          .then(() => {
            console.log('Usuário foi criado com sucesso!!');
          });
      }
    });
  // TODO: Create admin user
  // First, check if adminUser already exists in the database
  // If it doesn't exist, it needs to be saved

  next();
};

/*
 * Português Brasileiro:
 *
 * Fluxo de uma aplicação e requisição em node - express:
 *
 * request  -> middleware1 -> middleware2 -> rota
 *                                             |
 * response <- middleware4 <- middleware3   <---
 *
 * A essência é que a requisição passa por cada uma das funções intermediárias
 * ou "middlewares" até chegar à função da rota; em seguida, essa função gera a
 * resposta, que passa novamente por outras funções intermediárias até finalmente
 * responder à usuária.
 *
 * Um exemplo de middleware poderia ser uma função que verifica se uma usuária
 * está realmente registrada na aplicação e tem permissões para usar a rota. Ou
 * também um middleware de tradução, que altera a resposta dependendo do idioma
 * da usuária.
 *
 * É por isso que sempre veremos os argumentos request, response e next em nossos
 * middlewares e rotas. Cada uma dessas funções terá a oportunidade de acessar a
 * requisição (request) e cuidar de enviar uma resposta (quebrando a cadeia) ou
 * delegar a requisição para a próxima função na cadeia (invocando next). Dessa
 * forma, a requisição (request) passa através das funções, assim como a resposta
 * (response).
 */

module.exports = (app, next) => {
  // getUsers buscar por todos os usuários no banco de dados
  app.get('/users', requireAdmin, getUsers);

  // getUsersById buscar por um usuário pelo ID
  app.get('/users/:uid', requireAuth, getUsersById);

  // CreateUser criar um novo usuário
  app.post('/users', requireAdmin, createUser);

  // updateUser atualizar um usuário
  app.put('/users/:uid', requireAuth, updateUser);

  // deleteUser deletar um usuário
  app.delete('/users/:uid', requireAuth, deleteUser);

  initAdminUser(app, next);
};
