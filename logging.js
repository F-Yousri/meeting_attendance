const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

const logError = (errorMessage) => {
  logger.error(errorMessage);
};

const logInfo = (message) => {
    logger.info(message);
  };

module.exports = { logError, logInfo };