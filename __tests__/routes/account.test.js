const request = require('supertest');
const jwt = require('jsonwebtoken');

const authConfig = require('../../src/config/auth');

const { generateMockApp } = require('../../src/utils/mockapp');

const UserModel = require('../../src/app/models/User');
const AccountModel = require('../../src/app/models/Account');
const AccountTypesModel = require('../../src/app/models/AccountTypes');

const accountController = require('../../src/app/controllers/AccountController')(
  UserModel,
  AccountModel,
  AccountTypesModel
);

const accountRoutes = require('../../src/routes/account');

describe('Account routes', () => {
  let app;
  const auth = {};
  const id = 'f109c358-8d48-4a6e-8696-a4b9f6b424cd';
  let accountId;

  beforeAll(() => {
    app = generateMockApp(accountRoutes({ controller: accountController }));

    auth.token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
  });

  describe('Create a new account', () => {
    it('should return a new account', () =>
      request(app)
        .post(`/accounts/${id}`)
        .auth(auth.token, { type: 'bearer' })
        .send({
          balance: '300.00',
          daily_withdraw_limit: '500.00',
          active_account: true,
          account_type_id: 1,
        })
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.body).toHaveProperty('id');
          accountId = response.body.id;
        }));

    it('should return a error with status code 400 if account already exists.', () =>
      request(app)
        .post(`/accounts/${id}`)
        .auth(auth.token, { type: 'bearer' })
        .send({
          balance: '300.00',
          daily_withdraw_limit: '500.00',
          active_account: true,
          account_type_id: 1,
        })
        .then(() =>
          request(app)
            .post(`/accounts/${id}`)
            .auth(auth.token, { type: 'bearer' })
            .send({
              balance: '300.00',
              daily_withdraw_limit: '500.00',
              active_account: true,
              account_type_id: 1,
            })
            .then((resp) => {
              expect(resp.statusCode).toBe(400);
            })
        ));
  });

  describe('Show an account', () => {
    it('should return a specific account', () =>
      request(app)
        .get(`/accounts/${accountId}`)
        .auth(auth.token, { type: 'bearer' })
        .send()
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.body.id).toBe(accountId);
        }));
  });

  describe('Update an account', () => {
    it('should return an account with the active_account field false', () =>
      request(app)
        .put(`/accounts/${accountId}`)
        .auth(auth.token, { type: 'bearer' })
        .send({
          active_account: false,
        })
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.body.active_account).toBe(false);
        }));
  });
});
