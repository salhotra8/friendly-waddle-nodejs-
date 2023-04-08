const winston = require('winston');
require('winston-mongodb');

module.exports = winston.createLogger({

    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()),
            handleExceptions: true,
            handleRejections: true
        }),
        new winston.transports.File({
            filename: 'error.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.prettyPrint(),
            ),
        }),
        new winston.transports.File({
            filename: 'combined.log',
            format: winston.format.json(),
        }),
        // new winston.transports.MongoDB({db : 'mongodb+srv://nodejs:qzjbwttiCegQfXyG@nodejsdb.9looxxz.mongodb.net/Vidly'})
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: 'exceptions.log',
            handleExceptions: true,
        })
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: 'rejections.log',
            handleRejections: true
        })
    ]
});
