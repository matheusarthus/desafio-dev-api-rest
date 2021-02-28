const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) =>
    queryInterface.bulkInsert('users', [
      {
        id: 'f109c358-8d48-4a6e-8696-a4b9f6b424cd',
        name: 'João Alves',
        cpf: '99999999999',
        birth_date: '1998-04-01 00:00:00.000+00',
        password_hash: await bcrypt.hash('123456', 8),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]),

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
