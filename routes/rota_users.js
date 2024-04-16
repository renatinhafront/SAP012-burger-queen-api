const bcrypt = require('bcrypt');
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

  next();
};

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
