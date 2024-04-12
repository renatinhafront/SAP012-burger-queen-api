const { get } = require('mongoose');
const {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  deleteUser,
} = require('../users');

describe('getUsers', () => {
  it('Deve obter a lista de usuários', (done) => {
    done();
  });
});

describe('getUsersById', () => {
  it('Deve obter o usuário pelo ID', (done) => {
    done();
  });

  it('Deve retornar 404 quando o usuário não existe', (done) => {
    done();
  });
});

describe('createUser', () => {
  it('Deve verificar se o email está dentro do padrão', (done) => {
    done();
  });

  it('Deve verificar se o email está em uso', (done) => {
    done();
  });

  it('Deve retornar erro 400 ao criar o usuário', (done) => {
    done();
  });

  it('Deve criar o usuário', (done) => {
    done();
  });

  it('Deve retornar erro 500 ao processar a requisição', (done) => {
    done();
  });
});

describe('updateUser', () => {
  it('Deve retornar um erro 400 quando o ID é inválido', (done) => {
    done();
  });

  it('Deve retornar um erro 404 quando o usuário não existe', (done) => {
    done();
  });

  it('Deve retornar 200 ao atualizar o usuário', (done) => {
    done();
  });
});

describe('deleteUser', () => {
  it('Deve retornar um erro 400 quando o ID é inválido', (done) => {
    done();
  }); 

  it('Deve retornar um erro 404 quando o usuário não existe', (done) => {
    done();
  });

  it('Deve retornar 200 ao deletar o usuário', (done) => {
    done();
  });
});
