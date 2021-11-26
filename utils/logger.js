const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

const { combine, timestamp, printf } = winston.format;

const logDir = 'logs';

const format = printf(info => {
    return `{"timestamp":"${info.timestamp}", "level":"${info.level.toUpperCase()}", "fileType":"${info.message}"}`
});

const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format,
    ),
    transports: [
        new winston.transports.Console(),
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYYMMDD',
            dirname: logDir,
            filename: `%DATE%.log`,
            zippedArchive: false,
            json: true
        })
    ],
});

module.exports = logger