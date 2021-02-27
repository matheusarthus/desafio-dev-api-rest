const bodyParser = require('body-parser');
const log4js = require('log4js');
const setupRoutes = require('./routes');

require('./database');

const logger = log4js.getLogger('[App]');

module.exports = function configureExpressApp(app) {
  logger.debug('Starting to configure Express App');

  app.use(bodyParser.json());
  setupRoutes(app);

  return app;
};
