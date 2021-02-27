const log4js = require('log4js');
const { Router } = require('express');

const authMiddleware = require('../app/middlewares/auth');

const logger = log4js.getLogger('[Users Router]');

const { handleError } = require('../utils/responseHandler');
const {
  createUserValidation,
  updateUserValidation,
} = require('./validations/user');

function createUser(controller) {
  return async (req, res) => {
    logger.info('createUser');
    try {
      const user = await controller.store(req.body);

      if (user) {
        return res.status(201).json(user);
      }

      return res.status(500).json({ error: 'Could not create user profile' });
    } catch (error) {
      return handleError(res)(error);
    }
  };
}

function updateUser(controller) {
  return async (req, res) => {
    logger.info('updateUser');
    try {
      const user = await controller.update({ userId: req.userId, ...req.body });

      if (user) {
        return res.status(201).json(user);
      }

      return res.status(500).json({ error: 'Could not update user profile' });
    } catch (error) {
      return handleError(res)(error);
    }
  };
}

module.exports = (options) => {
  if (!options) {
    throw new Error('Expected to inform relevant parameters.');
  }

  const { controller } = options;

  if (!controller) {
    throw new Error('options.Controller is obligatory.');
  }

  const router = Router();

  router.post('/users', createUserValidation, createUser(controller));
  router.put(
    '/users',
    authMiddleware,
    updateUserValidation,
    updateUser(controller)
  );

  return router;
};
