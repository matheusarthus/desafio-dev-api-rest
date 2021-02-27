const log4js = require('log4js');
const { Router } = require('express');

const logger = log4js.getLogger('[Accounts Router]');

const { handleError } = require('../utils/responseHandler');
const {
  createAccountValidation,
  updateAccountValidation,
} = require('./validations/account');

function getAccount(controller) {
  return async (req, res) => {
    logger.info('getAccount');
    try {
      const account = await controller.show(req.params.id);

      if (account) {
        return res.status(201).json(account);
      }

      return res
        .status(500)
        .json({ error: 'Could not get an account for this id.' });
    } catch (error) {
      return handleError(res)(error);
    }
  };
}

function createAccount(controller) {
  return async (req, res) => {
    logger.info('createAccount');
    try {
      const account = await controller.store({
        user_id: req.params.userId,
        ...req.body,
      });

      if (account) {
        return res.status(201).json(account);
      }

      return res
        .status(500)
        .json({ error: 'Could not create account for this user.' });
    } catch (error) {
      return handleError(res)(error);
    }
  };
}

function updateAccount(controller) {
  return async (req, res) => {
    logger.info('updateAccount');
    try {
      const account = await controller.update({
        accountId: req.params.id,
        ...req.body,
      });

      if (account) {
        return res.status(201).json(account);
      }

      return res
        .status(500)
        .json({ error: 'Could not update the account for this id.' });
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

  router.get('/accounts/:id', getAccount(controller));
  router.post(
    '/accounts/:userId',
    createAccountValidation,
    createAccount(controller)
  );
  router.put(
    '/accounts/:id',
    updateAccountValidation,
    updateAccount(controller)
  );

  return router;
};
