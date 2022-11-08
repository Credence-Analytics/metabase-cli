/* eslint-disable prefer-template */
/* eslint-disable prefer-const */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable eqeqeq */

const path = require('path');
const fs = require('fs');
const os = require('os');
const Listr = require('listr');
const { monitorCtrlC } = require('monitorctrlc');
const { error } = require('@oclif/errors');
const chalk = require('chalk');

/**
 * Main catch block of the commands
 *
 * @param {error} err error object
 * @param {string} command Command which generated that error
 * @param {string} processType standard/docker
 */
 function errorHandler(err, processType = 'standard') {
    // Set log location based on the command
    let logLocation;
    logLocation = chalk.greenBright(path.resolve(`${os.homedir()}/.metabasecli/logs/%DATE%-result.log`));
    if (err.constructor.name === 'CredError') {
        if (processType !== 'docker') {
            if (Object.keys(err.options).includes('suggestions')) {
                err.options.suggestions.push(`For more information, check logs at ${logLocation}`);
            } else {
                err.options = { suggestions: [`For more information, check logs at ${logLocation}`] };
            }
        }
        error(err.message, err.options);
    } else {
        this.console.error(err.message ? err.message : err);
        if (processType !== 'docker') {
            this.console.error(`For more information, check logs at ${logLocation}`);
        }
    }
}

/**
 * It prevents user to interrupt listr process.
 *
 * @param {ListrContext} context - Context object passed inside run method.
 * @returns output of run() function
 */
 Listr.prototype.runWithoutInterrupt = function (context) {
    const monitor = monitorCtrlC();
    return this.run(context).finally(() => {
        monitor.dispose();
    });
};

const initCredConfig = () => {
    if (!fs.existsSync(path.join(global.METABASE_PATH, 'metabasecli_cfg.json'))) {
        const config = {
            metabase: {},
        };
        fs.writeFileSync(path.join(global.METABASE_PATH, 'metabasecli_cfg.json'), JSON.stringify(config, null, 2));
    }
    return path.join(global.METABASE_PATH, 'metabasecli_cfg.json');
};

module.exports = { initCredConfig, errorHandler, Listr, };
