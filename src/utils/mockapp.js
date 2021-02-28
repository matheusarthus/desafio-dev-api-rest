const express = require('express');
const bodyParser = require('body-parser');

require('../database');

const generateMockApp = (router) => {
  const app = express();
  app.use(bodyParser.json());
  app.use('/', router);

  return app;
};

exports.generateMockApp = generateMockApp;
