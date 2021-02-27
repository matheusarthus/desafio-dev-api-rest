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
    active_account: Joi.boolean().required(),
  }),
});

module.exports = {
  createAccountValidation,
  updateAccountValidation,
};
