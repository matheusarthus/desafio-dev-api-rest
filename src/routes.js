const { Router } = require('express');

const authMiddleware = require('./app/middlewares/auth');

const UserController = require('./app/controllers/UserController');
const AuthController = require('./app/controllers/AuthController');

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/auth', AuthController.store);

routes.use(authMiddleware);

routes.put('/users', (req, res) => res.json({ ok: true, id: req.userId }));

module.exports = routes;
