const { userRepository } = require('../../repository');

const {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  deleteUser,
} = require('../users');

jest.mock('../../repository/reposi_user.js', () => ({
  findAll: jest.fn(),
  findByID: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  deleteUser: jest.fn(),
}));

let req = {};
const resp = {
  status: jest.fn(() => resp),
  json: jest.fn(),
};

describe('getUsers', () => {
  it('Deve obter uma lista de usuários', async () => {
    const mockUsers = [
      {
        _id: '6619acbc13832c1f5a8f26eb',
        email: 'admin@localhost.com',
        role: 'admin',
        __v: 0,
      },
    ];

    userRepository.findAll.mockResolvedValueOnce(mockUsers);

    await getUsers(req, resp);

    // Verificar se a resposta tem status 200
    expect(resp.status).toHaveBeenCalledWith(200);
    // Verificar se a resposta contém a lista de usuários
    expect(resp.json).toHaveBeenCalledWith(mockUsers);
  });
});

describe('getUsersById', () => {
  it('Deve obter o usuário pelo ID', async () => {
    // eslint-disable-next-line operator-linebreak
    const mockUserId = {
      _id: '6619acbc13832c1f5a8f26eb',
      email: 'admin@localhost.com',
      role: 'admin',
      __v: 0,
    };

    userRepository.findByID.mockResolvedValueOnce(mockUserId);

    const req = {
      params: { uid: '6619acbc13832c1f5a8f26eb' },
    };

    await getUsersById(req, resp);

    // Verificar se a resposta tem status 200
    expect(resp.status).toHaveBeenCalledWith(200);
    // Verificar se a resposta contém a lista de usuário
    expect(resp.json).toHaveBeenCalledWith(mockUserId);
  });

  it('Deve retornar um erro 404 quando o ID for inválido', async () => {
    const req = {
      params: { },
    };

    await getUsersById(req, resp);

    // Verificar se a resposta tem status 404
    expect(resp.status).toHaveBeenCalledWith(404);
    // Verificar se a resposta contém a mensagem de erro
    expect(resp.json).toHaveBeenCalledWith({ error: 'ID de usuário inválido' });
  });

  it('Deve retornar um erro 404 quando o usuário não for encontrado', async () => {
    userRepository.findByID.mockResolvedValueOnce(null);

    req = {
      params: { uid: 'banana' },
    };

    await getUsersById(req, resp);

    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
  });
});

describe('createUser', () => {
  it('Deve criar um novo usuário', async () => {
    // Given/Arrange
    const mockUsuarioBanco = {
      _id: '6619acbc138333c1f5a8f26eb',
      email: 'admin@localhost.com',
      role: 'admin',
      __v: 0,
    };

    userRepository.create.mockResolvedValueOnce(mockUsuarioBanco);
    userRepository.findByEmail.mockResolvedValueOnce(null);

    req = {
      body: { email: 'admin@localhost.com', role: 'admin', password: 'xxxx' },
    };

    // When/Act
    await createUser(req, resp);

    // Then/Assert
    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith(
      {
        message: 'Usuário criado com sucesso',
      },
    );
  });

  it('Deve seguir as regras do regex no email', async () => {
    req = {
      body: {
        email: 'adminlocalhost',
      },
    };
    await createUser(req, resp);

    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Email de usuário inválido.' });
  });

  it('Deve retornar quando o user ja esxistir no BD', async () => {
    const mockUserExists = {
      _id: '6619acbc138333c1f5a8f26eb',
      email: 'admin@localhost.com',
      role: 'admin',
      __v: 0,
    };

    userRepository.findByEmail.mockResolvedValueOnce(mockUserExists);

    req = {
      body: { email: 'admin@localhost.com' },
    };

    await createUser(req, resp);

    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Email já está em uso.' });
  });

  it('Deve retornar falha ao criar um novo usuário', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(null);
    userRepository.create.mockResolvedValueOnce(null);

    req = {
      body: { email: 'admin@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await createUser(req, resp);

    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Falha ao criar usuário.' });
  });

  it('Retornar erro em caso de erro interno', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(null);
    userRepository.create.mockRejectedValueOnce(new Error('Erro interno no servidor'));

    req = {
      body: { email: 'admin@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await createUser(req, resp);

    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});

describe('updateUser', () => {
  it('Deve retornar sucesso quando for alterado o user', async () => {
    const mockUserUpdated = {
      _id: '6619acbc13832c1f5a8f26eb',
      email: 'admin2@localhost.com',
      role: 'admin',
      __v: 0,
    };

    userRepository.update.mockResolvedValueOnce(mockUserUpdated);

    req = {
      params: { uid: '6619acbc13832c1f5a8f26eb' },
      body: { email: 'admin2@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await updateUser(req, resp);

    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith(mockUserUpdated);
  });

  it('Deve retornar erro 400 quando o ID é inválido', async () => {
    req = {
      params: { },
    };

    await updateUser(req, resp);

    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'ID de usuário inválido' });
  });

  it('Deve retornar erro 404 quando o usuário não existe', async () => {
    userRepository.update.mockResolvedValueOnce(null);

    req = {
      params: { uid: '6619acbc13832c1f5a8f26eb' },
      body: { email: 'admin2@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await updateUser(req, resp);

    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
  });
});

describe('deleteUser', () => {
  it('Deve retornar 200 ao deletar o usuário', async () => {
    const mockUserDelete = {
      _id: '6619acbc13832c1f5a8f26eb',
    };

    userRepository.deleteUser.mockResolvedValueOnce(mockUserDelete);

    req = {
      params: { uid: '619acbc13832c1f5a8f26eb' },
    };

    await deleteUser(req, resp);

    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith(mockUserDelete);
  });

  it('Deve retornar um erro 400 quando o ID é inválido', async () => {
    req = {
      params: { },
    };

    await deleteUser(req, resp);

    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'ID de usuário inválido' });
  });

  it('Deve retornar um erro 404 quando o usuário não existe', async () => {
    userRepository.deleteUser.mockResolvedValueOnce(null);

    req = {
      params: { uid: '619acbc13832c1f5a8f26eb' },
    };

    await deleteUser(req, resp);

    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
  });
});
