const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const log4js = require('log4js');
const cors = require('cors');
const setupRoutes = require('./routes');

const logger = log4js.getLogger('[App]');

module.exports = function configureExpressApp(app) {
  logger.debug('Starting to configure Express App');

  app.use(cors());
  app.use(bodyParser.json());
  setupRoutes(app);

  app.use(errors());

  return app;
};
