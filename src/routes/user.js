const log4js = require('log4js');
const { Router } = require('express');

const logger = log4js.getLogger('[Users Router]');

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
      return res.status(400).json({ error: 'User already exists.' });
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

  router.post('/users', createUser(controller));

  return router;
};
