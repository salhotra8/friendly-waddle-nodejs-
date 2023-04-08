const express = require('express');
const logger = require('./winston-logger/logger');
const app = express();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();

process.on('uncaughtException', (ex) => {
  logger.error(ex);
  process.exit(1);
});

process.on('unhandledRejection', (ex) => {
  logger.error(ex);
  process.exit(1);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}`));

module.exports = server;


