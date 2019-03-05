import {createLogger as winstonLoggerFactory, QueryOptions, transports} from 'winston';


let logger = winstonLoggerFactory({
    level: "debug", //TODO: Make configurable
    transports: [
        new (transports.Console)(),
        new (transports.File)({
            filename: "/tmp/mongotron.log" //TODO: Make configurable
        })
    ]
});

/** @module Logger */
/** @class */
export class LoggerService {

    /**
     * Log a debug message
     * @param {string} msg - Message to log
     */
    public static debug(msg) {
        logger.debug(msg);
    }

    /**
     * Log an info message
     * @param {string} msg - Message to log
     */
    public static info(msg) {
        logger.info(msg);
    }

    /**
     * Log a warn message
     * @param {string} msg - Message to log
     */
    public static warn(msg) {
        logger.warn(msg);
    }

    /**
     * Log an error message
     * @param {string} msg - Message to log
     */
    public static error(msg) {
        logger.error(msg);
    }

    /**
     * List log messages
     * @param queryOptions
     */
    public static list(queryOptions: QueryOptions) {
        return new Promise(function (resolve, reject) {
            logger.query(queryOptions, function (err, results) {
                if (err) return reject(err);

                return resolve(results);
            });
        });
    }
}

