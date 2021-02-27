require('./utils/loggerConfig');

const log4js = require('log4js');

const logger = log4js.getLogger('[Start up script]');

const http = require('http');
const express = require('express');
const configureExpressApp = require('./app');

const app = express();
const server = http.createServer(app);

configureExpressApp(app);

server.listen(3333, () => {
  logger.info(`Server running on: ${process.env.APP_URL}`);
});
