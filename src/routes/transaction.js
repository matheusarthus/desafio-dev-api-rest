const log4js = require('log4js');
const { Router } = require('express');

const logger = log4js.getLogger('[Transaction Router]');

const { handleError } = require('../utils/responseHandler');
const {
  depositTransactionValidation,
  withdrawTransactionValidation,
  transferTransactionValidation,
} = require('./validations/transaction');

function depositTransaction(controller) {
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

function withdrawTransaction(controller) {
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

function transferTransaction(controller) {
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

  router.post('/transactions/:userId/deposit', depositTransaction(controller));
  /*   router.post(
    '/transactions/:userId/withdraw',
    createUserValidation,
    withdrawTransaction(controller)
  );
  router.post(
    '/transactions/transfer',
    createUserValidation,
    transferTransaction(controller)
  ); */

  return router;
};
