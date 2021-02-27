const log4js = require('log4js');
const { Router } = require('express');

const logger = log4js.getLogger('[Users Router]');

const { handleError } = require('../utils/responseHandler');

function createAuth(controller) {
  return async (req, res) => {
    logger.info('createAuth');
    try {
      const auth = await controller.store(req.body);

      if (auth) {
        return res.status(201).json(auth);
      }

      return res
        .status(500)
        .json({ error: 'Could not create user authentication' });
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

  router.post('/auth', createAuth(controller));

  return router;
};
