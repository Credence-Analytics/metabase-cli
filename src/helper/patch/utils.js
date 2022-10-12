/* eslint-disable unicorn/prefer-ternary */
/* eslint-disable unicorn/explicit-length-check */
/* eslint-disable unicorn/prefer-optional-catch-binding */
/* eslint-disable unicorn/prefer-array-some */
/* eslint-disable no-unused-vars */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable no-loop-func */
/* eslint-disable no-shadow */
/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs-extra');
const path = require('path');
const Listr = require('listr');
const { monitorCtrlC } = require('monitorctrlc');
const os = require('os');
const { error } = require('@oclif/core');
const chalk = require('chalk');

const { initLogger, CredError } = require(path.join(__dirname, '../logger.js'));
let logger = initLogger('patch');
/**
 * To check write permissions before doing any operation
 *
 * @param {string} filePath Path of the dir/file
 * @returns {boolean} true or throws an error
 */
async function checkWritePermission(filePath) {
    try {
        await fs.access(filePath, fs.constants.W_OK);
        return true;
    } catch (error) {
        // give ref on how to give write permissions.
        throw new CredError(error.message, {
            suggestions: ['Change folder permission'],
            ref: 'https://www.online-tech-tips.com/computer-tips/set-file-folder-permissions-windows/',
        });
    }
}

/**
 * Validates if a path exists or not
 *
 * @param {string} filetype extension of file
 * @returns {function}
 */
function validatePath(filetype = '') {
    return function (filePath) {
        // if (path.extname(filePath).toLowerCase() !== filetype) {
        //     if (filetype === '') {
        //         return 'Not a folder';
        //     }
        //     return `Not a '${filetype}' file`;
        // }

        if (fs.existsSync(filePath)) {
            return true;
        }
        return `Path does not exist. Please enter a valid path.`;
    };
}

/**
 * Checks config.json and reads it
 *
 * @param {string} configFilePath Path of config.json
 * @returns {object} Data from config file
 */
function readConfig(configFilePath) {
    // https://github.com/oclif/errors/blob/master/test/error.test.ts
    // check if config.json doesn't exists
    if (!fs.existsSync(configFilePath)) {
        throw new CredError('cred-patch is not initialized', { suggestions: ['credcli patch:init'] });
    }
    return JSON.parse(fs.readFileSync(configFilePath)); // configData
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

/**
 * Get list of affected services for a patch
 *
 * @param {String} patchName - Name of patch
 * @param {object} configData Data from config.json
 * @returns {Array} - List of services affected in the given patchName
 */
function getAffectedServicesForPatch(patchName, configData) {
    let affectedServices;
    if (configData.processType === 'docker') {
        const { targetServices } = configData.patchesApplied.find((patch) => patch.version === patchName);
        affectedServices = Object.keys(targetServices);
    } else {
        affectedServices = [...configData.patchesApplied.find((patch) => patch.version === patchName).targetServices];
    }
    if (configData.dbChanges.find((patch) => patch.version === patchName)) {
        affectedServices.push('dbChanges');
    }
    return affectedServices;
}

async function validatePatchInDb(dbConnection, configData, patchVersion) {
    logger.info(`Executing query to check if the patch is already applied`);
    let queryResponse;
    try {
        queryResponse = await dbConnection.execute(`SELECT 1 FROM ver_patch_master WHERE patch_no='${patchVersion}'`);
    } catch (error) {
        logger.info(`Error occured while executing the query: SELECT 1 FROM ver_patch_master WHERE patch_no='${patchVersion}'`);
    }

    logger.info(`Query response: ${JSON.stringify(queryResponse)}`);

    if (queryResponse.rows.length >= 1) {
        logger.info(`Patch version is already present in the database. Process will skip dbScript`);
        return true;
    }
    return false;
}

async function dbUpdateTask(dbConnection, dbscriptPath, revertScriptPath) {
    return new Listr([
        {
            title: 'Updating database',
            task: async (_, dbTask) => {
                logger.info('Apply: Updating database');
                const sql = (await fs.readFile(dbscriptPath)).toString().replace(/(\r\n|\n|\r)/gm, ' ');
                const queries = sql.split(';/');
                for (let i = 0; i < queries.length; i++) {
                    queries[i] = queries[i].trim();
                    // make sure the qyuery is not empty
                    if (queries[i].length !== 0) {
                        try {
                            logger.debug(`Executing query: ${queries[i]}`);
                            await dbConnection.execute(queries[i]);
                        } catch (error) {
                            logger.error(error.stack ? error.stack : error);
                            logger.info(`Error occured while executing the query: ${queries[i]}`);
                            logger.info('Apply: Initiating database revert');
                            // Execute revert
                            return new Listr([
                                {
                                    title: 'Reverting database changes',
                                    async task() {
                                        try {
                                            dbTask.output = error;
                                            const sql = (await fs.readFile(revertScriptPath)).toString().replace(/(\r\n|\n|\r)/gm, '');
                                            const queries = sql.split(';/');
                                            for (let i = 0; i < queries.length; i++) {
                                                queries[i] = queries[i].trim();
                                                if (queries[i].length !== 0) {
                                                    await dbConnection.execute(queries[i]);
                                                }
                                            }
                                        } catch (error) {
                                            logger.error(`Apply: Error in revertScript: ${error.stack ? error.stack : error}`);
                                            if (dbConnection) {
                                                await dbConnection.close();
                                            }
                                            throw new CredError('Error occured while reverting database script. Please make changes manually.');
                                        }
                                    },
                                },
                                {
                                    title: 'Database stage Failed',
                                    task: async () => {
                                        logger.info('Apply: Database revert complete');
                                        throw new CredError('Error occured while updating database. The changes were reverted.');
                                    },
                                },
                            ]);
                        }
                    }
                }

                logger.info('Apply: Database Updated');
            },
        },
    ]);
}

async function addVersionInDb(dbConnection, configData, patchInfo) {
    const query = `Begin
    INSERT INTO ver_patch_master(patch_no, codebase, prev_patch_no, release_date, released_by, total_no_objects, total_no_tir, authorised_by, qa_certified, uploaded_by, uploaded_on, applied_by, applied_on, comments, upload_status, error_desc, codechanges, dbchanges, isaddon, parentaddon) VALUES('${patchInfo.patchVersion}', '2', '${patchInfo.oldPatchVersion}', sysdate, 'credcli', ${patchInfo.fileCount}, '0','credcli', 'yes', 'credcli', sysdate, 'credcli', sysdate, NULL, 'APP', NULL, 'yes', '${
        patchInfo.dbPatch ? 'yes' : 'no'
    }', 'no', '${patchInfo.oldPatchVersion}');
    update ver_parameter set CURRENT_PATCHNO = '${patchInfo.patchVersion}';
    End;`;
    logger.info(`Executing query to add patch information to database: ${query}`);
    try {
        const response = await dbConnection.execute(query);
        logger.info(`Response of query: ${JSON.stringify(response)}`);
    } catch (error) {
        logger.info(`Error occured while executing the query}`);
    }
}

/**
 * Main catch block of the commands
 *
 * @param {error} err error object
 * @param {string} command Command which generated that error
 * @param {string} processType standard/docker
 */
function errorHandler(err, command, processType = 'standard') {
    logger = initLogger(command);
    logger.error(`${command}: ${err.stack ? err.stack : err}`);

    // Set log location based on the command
    let logLocation;
    // eslint-disable-next-line no-param-reassign
    command = command.toLowerCase();
    // const patchCommands = ['init', 'apply', 'info', 'revert', 'push', 'pull'];
    if (command === 'template') {
        logLocation = chalk.greenBright(path.resolve(`${os.homedir()}/.credcli/logs/template/`));
        // } else if (patchCommands.includes(command)) {
        //     logLocation = chalk.greenBright(path.resolve(`${os.homedir()}/.credcli/logs/patch/`));
    } else {
        logLocation = chalk.greenBright(path.resolve(`${os.homedir()}/.credcli/logs/${command}`));
    }
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

module.exports = {
    checkWritePermission,
    validatePath,
    readConfig,
    Listr,
    getAffectedServicesForPatch,
    validatePatchInDb,
    dbUpdateTask,
    addVersionInDb,
    errorHandler,
};
