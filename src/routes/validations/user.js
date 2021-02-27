const { celebrate, Joi } = require('celebrate');

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    cpf: Joi.string().required(),
    birth_date: Joi.date().required(),
    password: Joi.string().required(),
  }),
});

const updateUserValidation = celebrate({
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
  createUserValidation,
  updateUserValidation,
};
