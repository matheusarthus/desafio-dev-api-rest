require('./utils/loggerConfig');

const log4js = require('log4js');
const chalk = require('chalk');

const logger = log4js.getLogger('[Start up script]');

const http = require('http');
const express = require('express');
const configureExpressApp = require('./app');

const app = express();
const server = http.createServer(app);

configureExpressApp(app);

const divider = chalk.gray('███████████████████████████████████');

server.listen(3333, () => {
  logger.info(divider);
  logger.info(`Server running on: ${chalk.cyanBright(process.env.APP_URL)}`);
});
