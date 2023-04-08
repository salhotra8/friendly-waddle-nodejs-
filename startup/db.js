const mongoose = require('mongoose');
const logger = require('../winston-logger/logger');
const config = require('config');

module.exports = function () {
    const db = config.get('db');

    mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => logger.info(`Connected to ${db}`))

}