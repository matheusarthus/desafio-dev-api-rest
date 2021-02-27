const bodyParser = require('body-parser');
const setupRoutes = require('./routes');

require('./database');

module.exports = function configureExpressApp(app) {
  app.use(bodyParser.json());
  setupRoutes(app);

  return app;
};
