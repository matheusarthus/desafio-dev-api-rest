const http = require('http');
const express = require('express');
const configureExpressApp = require('./app');

const app = express();
const server = http.createServer(app);

configureExpressApp(app);

server.listen(3333);
