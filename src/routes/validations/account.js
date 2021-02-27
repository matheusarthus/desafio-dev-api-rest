const { celebrate, Joi } = require('celebrate');

const createAccountValidation = celebrate({
  body: Joi.object().keys({
    balance: Joi.number().required(),
    daily_withdraw_limit: Joi.number().required(),
    active_account: Joi.boolean().required(),
    account_type_id: Joi.number().required(),
  }),
});

const updateAccountValidation = celebrate({
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

module.exports = {
  createAccountValidation,
  updateAccountValidation,
};
