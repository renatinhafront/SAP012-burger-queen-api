const bcrypt = require('bcrypt');
const { param } = require('express-validator');
const { userRepository } = require('../repository');

const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  isValid,
} = require('../middleware/validator');

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
            console.info('Usuário foi criado com sucesso!!');
          });
      }
    });

  next();
};

const ckeckId = param('id').exists().isInt({ min: 1 }).withMessage('ID inválido');
module.exports = (app, next) => {
  // getUsers buscar por todos os usuários no banco de dados
  app.get('/users', requireAdmin, getUsers);

  // getUsersById buscar por um usuário pelo ID
  app.get('/users/:id', requireAuth, ckeckId, isValid, getUsersById);

  // CreateUser criar um novo usuário
  app.post('/users', requireAdmin, createUser);

  // updateUser atualizar um usuário
  app.put('/users/:id', requireAuth, ckeckId, isValid, updateUser);

  // deleteUser deletar um usuário
  app.delete('/users/:id', requireAuth, ckeckId, isValid, deleteUser);

  initAdminUser(app, next);
};
