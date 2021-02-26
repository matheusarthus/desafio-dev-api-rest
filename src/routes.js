const { Router } = require('express');
const User = require('./app/models/User');

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Matheus Arthus',
    cpf: '41623434890',
    birth_date: new Date(),
    password_hash: '123455',
  });

  res.json(user);
});

module.exports = routes;
