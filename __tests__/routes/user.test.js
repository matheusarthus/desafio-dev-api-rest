const request = require('supertest');

const { generateMockApp } = require('../../src/utils/mockapp');

const UserModel = require('../../src/app/models/User');

const userController = require('../../src/app/controllers/UserController')(
  UserModel
);

const userRoutes = require('../../src/routes/user');

describe('Create a new user', () => {
  let app;

  beforeAll(() => {
    app = generateMockApp(userRoutes({ controller: userController }));
  });

  it('should return a new user', () =>
    request(app)
      .post('/users')
      .send({
        name: 'Raphaella Campos',
        cpf: '11111111111',
        birth_date: '1998-04-01 00:00:00.000+00',
        password: '123456',
      })
      .then((response) => {
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
      }));

  it('should return a error with status code 400 if user already exists.', () =>
    request(app)
      .post('/users')
      .send({
        name: 'João Alves',
        cpf: '99999999999',
        birth_date: '1998-04-01 00:00:00.000+00',
        password: '123456',
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      }));
});
