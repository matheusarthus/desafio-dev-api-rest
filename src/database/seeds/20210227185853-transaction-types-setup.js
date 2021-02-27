module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('transaction_types', [
      {
        type: 'deposit',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: 'withdraw',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: 'transfer',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]),

  down: (queryInterface) =>
    queryInterface.bulkDelete('transaction_types', null, {}),
};
