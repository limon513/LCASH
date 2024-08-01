const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, errors } = format;

const myFormat = printf(({ level, message, label, timestamp, errors }) => {
  return `${timestamp} : ${level} : ${label} : ${message}:\nerror = ${JSON.stringify(errors)}`;
});

const logger = createLogger({
  format: combine(
    timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({filename:'combine.log'})
  ]
});

module.exports = logger;