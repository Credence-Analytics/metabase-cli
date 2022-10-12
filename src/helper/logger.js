/* eslint-disable unicorn/prefer-module */
const chalk = require('chalk');
const os = require('os');

const winston = require('winston');
require('winston-daily-rotate-file');

/**
 * Custom Error class to support nested thrown errors for oclif/errors
 * As`new Error` does not provide a way to specify options(suggestions/code/.. more on @oclif/errors)
 */
class CredError extends Error {
    /**
     *
     * @param {string} msg - simple message of an error
     * @param {object} options - oclif/errors options
     * @param  {...any} params - remaining args to pass on Error class
     */
    constructor(msg, options = {}, ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CredError);
        }

        this.name = 'CredError';
        // Custom debugging information
        this.message = chalk.redBright(msg);
        this.options = options;
    }
}

/**
 * Initialize the logger
 *
 * @param {string} homeDir User's home directory
 * @param {string} command what command is tring to log (patch or macro)
 */
function initLogger(homeDir, command) {
    const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
        filename: `${homeDir}/.credcli/logs/${command}/%DATE%-result.log`,
        datePattern: 'YYYY-MM-DD',
        maxSize: '10m',
        maxFiles: '3d',
    });

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
        ),

        transports: [dailyRotateFileTransport],
    });
    return logger;
}

/**
 * This add custom log method to passed object
 *
 * @param {Function Contructor Object} obj - FunctionConstructor/Class Object
 * @returns null - as objects are pass by ref
 */
function setConsoleLog(obj) {
    obj.prototype.console = {};
    const self = obj.prototype;
    obj.prototype.console.log = function (msg) {
        self.log(`${chalk.greenBright('>')} ${msg}`);
    };
    obj.prototype.console.error = function (msg) {
        self.log(chalk.redBright(`$ ${msg}`));
    };
    obj.prototype.console.warn = function (msg) {
        self.log(chalk.yellowBright(`! ${msg}`));
    };
}

module.exports = {
    initLogger: initLogger.bind(this, os.homedir()),
    setConsoleLog,
    CredError,
};
