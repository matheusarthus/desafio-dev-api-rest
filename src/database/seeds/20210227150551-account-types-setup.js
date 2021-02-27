module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('account_types', [
      {
        type: 'individual account',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: 'corporate account',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]),

  down: (queryInterface) =>
    queryInterface.bulkDelete('account_types', null, {}),
};
