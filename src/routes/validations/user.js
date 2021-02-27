const { celebrate, Joi } = require('celebrate');

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    cpf: Joi.string().required(),
    birth_date: Joi.date().required(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  createUserValidation,
};
