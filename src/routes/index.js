const userRoutes = require('./user');
const authRoutes = require('./auth');
const accountRoutes = require('./account');
// const transactionRoutes = require('./transaction');

const authMiddleware = require('../app/middlewares/auth');

const UserModel = require('../app/models/User');
const AccountModel = require('../app/models/Account');
// const TransactionModel = require('../app/models/Transaction');

const userController = require('../app/controllers/UserController')(UserModel);
const authController = require('../app/controllers/AuthController')(UserModel);
const accountController = require('../app/controllers/AccountController')(
  UserModel,
  AccountModel
);
// const transactionController = require('../app/controllers/AuthController')(UserModel);

module.exports = (app) => {
  app.use('/', userRoutes({ controller: userController }));
  app.use('/', authRoutes({ controller: authController }));

  app.use(authMiddleware);

  app.use('/', accountRoutes({ controller: accountController }));
  // app.use('/', transactionRoutes({ controller: transactionController }));
};
