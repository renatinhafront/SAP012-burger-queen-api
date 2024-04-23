const bcrypt = require('bcrypt');
const { userRepository } = require('../repository');
// const { obj } = require('../schema/user');

function prepUser(body) {
  // recebe o body e vai criar um novo usuario
  const user = {
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  };

  return user;
}

module.exports = {
  getUsers: async (req, resp) => {
    try {
      const listaUsuarios = await userRepository.findAll();

      return resp.status(200).json(listaUsuarios);
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },

  getUsersById: async (req, resp) => {
    try {
      const { id } = req.params;
      // if (!uid || typeof uid !== 'number') {
      //   return resp.status(404).json({ error: 'ID de usuário inválido' });
      // }
      const user = await userRepository.findByID(id);

      if (!user) {
        return resp.status(404).json({ error: 'Usuário não encontrado.' });
      }

      return resp.status(200).json(user);
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },

  createUser: async (req, resp) => {
    try {
      const { email } = req.body;

      const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

      if (!reg.test(email)) {
        return resp.status(400).json({ error: 'Email de usuário inválido.' });
      }

      // Verificar se o email já existe
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        return resp.status(400).json({ error: 'Email já está em uso.' });
      }

      // Se o email não existir, criar o usuário
      const newUser = await userRepository.create(prepUser(req.body));

      if (!newUser) {
        return resp.status(400).json({ error: 'Falha ao criar usuário.' });
      }

      return resp.status(200).json(newUser);
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },

  updateUser: async (req, resp) => {
    try {
      const { id } = req.params;
      // if (!uid || typeof uid !== 'number') {
      //   return resp.status(400).json({ error: 'ID de usuário inválido' });
      // }

      const user = await userRepository.update(id, prepUser(req.body));

      if (!user) {
        return resp.status(404).json({ error: 'Usuário não encontrado.' });
      }
      return resp.status(200).json(user);
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },

  deleteUser: async (req, resp) => {
    try {
      const { id } = req.params;
      // if (!uid || typeof uid !== 'number') {
      //   return resp.status(400).json({ error: 'ID de usuário inválido' });
      // }

      const user = await userRepository.deleteUser(id);

      if (!user) {
        return resp.status(404).json({ error: 'Usuário não encontrado.' });
      }

      return resp.status(200).json({ message: 'Usuário excluído com sucesso!' });
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },
};
