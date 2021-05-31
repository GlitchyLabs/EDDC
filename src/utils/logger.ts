import { createLogger, format, transports } from 'winston';

const logger = createLogger();

const defaultFormat = format.combine(
    format.colorize(),
    format.timestamp({format: 'DD/MM HH:mm:ss'}),
    format.splat(),
    format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
);

if (process.env.DEBUG === 'true') {
    logger.add(new transports.Console({
        level: process.env.LOG_LEVEL || 'debug',
        format: defaultFormat
    }));
} else {
    logger.add(new transports.Console({
        level: 'info',
        format: defaultFormat
    }));
}

export default logger;