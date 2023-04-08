const logger = require('../winston-logger/logger');



module.exports = function (err, req, res, next) {
    logger.error(err.message, err);

    // logging levels :- 
    // error
    // warning
    // info
    // http
    // verbose
    // debug
    // silly

    res.status(500).send("Something failed")
};