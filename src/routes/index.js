const userRoutes = require('./user');
const authRoutes = require('./auth');
const transactionRoutes = require('./transaction');
const accountRoutes = require('./account');

const UserModel = require('../app/models/User');

const userController = require('../app/controllers/UserController')(UserModel);
// const authController = require('../app/controllers/AuthController')();

module.exports = (app) => {
  app.use('/', userRoutes({ controller: userController }));
  // app.use('/', authRoutes({ controller: authController }));
};
