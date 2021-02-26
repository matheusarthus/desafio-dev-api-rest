const { Router } = require('express');

const UserController = require('./app/controllers/UserController');
const AuthController = require('./app/controllers/AuthController');

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/auth', AuthController.store);

module.exports = routes;
