const userRoutes = require('./user');
const authRoutes = require('./auth');
const transactionRoutes = require('./transaction');
const accountRoutes = require('./account');

const authMiddleware = require('../app/middlewares/auth');

const UserModel = require('../app/models/User');

const userController = require('../app/controllers/UserController')(UserModel);
const authController = require('../app/controllers/AuthController')(UserModel);

module.exports = (app) => {
  app.use('/', userRoutes({ controller: userController }));
  app.use('/', authRoutes({ controller: authController }));

  app.use(authMiddleware);
};
