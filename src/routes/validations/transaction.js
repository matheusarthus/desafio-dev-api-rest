const { celebrate, Joi } = require('celebrate');

const depositTransactionValidation = celebrate({
  body: Joi.object().keys({
    value: Joi.number().required(),
  }),
});

const withdrawTransactionValidation = celebrate({
  body: Joi.object().keys({
    value: Joi.number().required(),
  }),
});

const transferTransactionValidation = celebrate({
  body: Joi.object().keys({
    fromAccountId: Joi.string().required(),
    toAccountId: Joi.string().required(),
    value: Joi.number().required(),
  }),
});

module.exports = {
  depositTransactionValidation,
  withdrawTransactionValidation,
  transferTransactionValidation,
};
