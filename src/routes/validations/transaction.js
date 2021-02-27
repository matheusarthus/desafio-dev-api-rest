const { celebrate, Joi } = require('celebrate');

const depositTransactionValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    cpf: Joi.string().required(),
    birth_date: Joi.date().required(),
    password: Joi.string().required(),
  }),
});

const withdrawTransactionValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    cpf: Joi.string(),
    birth_date: Joi.date(),
    oldPassword: Joi.string(),
    password: Joi.alternatives().conditional('oldPassword', {
      not: '',
      then: Joi.string().required(),
      otherwise: Joi.string(),
    }),
    confirmPassword: Joi.alternatives().conditional('password', {
      not: '',
      then: Joi.string().required().valid(Joi.ref('password')),
      otherwise: Joi.string(),
    }),
  }),
});

const transferTransactionValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    cpf: Joi.string().required(),
    birth_date: Joi.date().required(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  depositTransactionValidation,
  withdrawTransactionValidation,
  transferTransactionValidation,
};
