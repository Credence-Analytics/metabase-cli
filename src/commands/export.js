/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */

/* eslint-disable array-callback-return */

/* eslint-disable unicorn/consistent-destructuring */

/* eslint-disable one-var */
/* eslint-disable prefer-const */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable prettier/prettier */
/* eslint-disable unicorn/prefer-module */

const { Command } = require('@oclif/core');
const path = require('path');
const { prompt } = require('enquirer');
const fs = require('fs-extra');
const chalk = require('chalk');
const moment = require('moment');

const { errorHandler } = require(path.join(__dirname, '../../helper/patch/utils.js'));
const { setConsoleLog, initLogger, CredError } = require(path.join(__dirname, '../../helper/logger.js'));

const logger = initLogger('metabase');
const { sendRequest, validateCredConfig, getMetabaseSessionID } = require(path.join(__dirname, '../../helper/api-utils.js'));

setConsoleLog(Command);

function formatDate(dateObj, dateFormat) {
    return moment(dateObj).format(dateFormat);
}

async function storeResponse({ detailedInfo, basicInfo: { name: quesOrDashName }, type, fileName }) {
    try {
        let dateObj = new Date(),
            finalFileName = `${fileName.toLowerCase()}${formatDate(dateObj, 'YYYY-MM-DD HH mm ss')}.json`.split(' ').join('_'),
            finalResponse = {
                date: formatDate(dateObj, 'YYYY-MM-DD'),
                type,
                typename: quesOrDashName,
                data: detailedInfo,
            },
            responseFilePath;

        const directory = await prompt([
            {
                type: 'input',
                name: 'save',
                message: 'Enter the export folder path',
                initial: path.resolve('./'),
                result: (input) => {
                    return path.resolve(input);
                },
            },
        ]);

        if (!fs.existsSync(directory.save) || !fs.statSync(directory.save).isDirectory()) {
            logger.info(`Provided directory : ${directory.save} is not valid. Stopping the export...`);
            throw new Error(`Provided directory : ${directory.save} is not valid.`);
        }
        responseFilePath = path.join(directory.save, finalFileName);
        logger.info(`Storing ${type === 'D' ? 'dashboard' : 'question'} data ${JSON.stringify(finalResponse)} to ${responseFilePath} file`);
        await fs.outputFile(responseFilePath, JSON.stringify(finalResponse, null, 2));
        logger.info(`Successfully stored ${type === 'D' ? 'dashboard' : 'question'} in ${responseFilePath} file`);
        this.console.log(`Successfully stored ${type === 'D' ? 'dashboard' : 'question'} in ${chalk.greenBright(responseFilePath)} file`);
    } catch (error) {
        throw error;
    }
}

async function exportDashboard({ sessionID }) {
    try {
        let APIURL = `${global.credConfig.metabase.url}/api/dashboard`,
            options = {
                headers: {
                    'X-Metabase-Session': sessionID,
                },
            },
            response,
            fileName,
            dashboardList = [];

        logger.info(`Fetching all the dashboards`);
        response = await sendRequest(null, options, 'GET', APIURL, 'to get all the dashboards');
        logger.info('Successfully fetched all the dashboards');

        dashboardList = response.map(({ name, id }) => {
            return { name, id };
        });

        if (dashboardList.length === 0) {
            throw new Error('There is no dashboard available for export');
        }

        const dashboard = await prompt([
            {
                type: 'select',
                name: 'info',
                message: 'Please select the dashboard:',
                result: (dashboardName) => {
                    let dashboardInfo;
                    dashboardList.map(({ name, id }) => {
                        if (name === dashboardName) {
                            dashboardInfo = { id, name };
                        }
                    });
                    return dashboardInfo;
                },
                choices: dashboardList.map(({ name }) => name),
            },
        ]);

        const {
            info: { id, name },
        } = dashboard;

        logger.info(`User has selected ${name} dashboard`);
        APIURL = `${global.credConfig.metabase.url}/api/dashboard/${id}`;
        logger.info(`Fetching Info. about dashboard ${name}`);
        response = await sendRequest(null, options, 'GET', APIURL, 'to get detailed information of selected dashboard');
        logger.info(`Successfully fetched dashboard ${name}`);

        fileName = `dashboard_${name}_`;
        await storeResponse({ detailedInfo: response, basicInfo: dashboard.info, type: 'D', fileName });
    } catch (error) {
        if (error.name !== 'CredError' && error.message) throw new CredError(`${error.message}`);
        error.name = 'Metabase API call failed';
        logger.error(`${error.stack ? error.stack : error}`);
        throw new CredError('Dashboard export failed');
    }
}

async function exportQuestion({ sessionID }) {
    try {
        let APIURL = `${global.credConfig.metabase.url}/api/card`,
            options = {
                headers: {
                    'X-Metabase-Session': sessionID,
                },
            },
            response,
            fileName,
            questionsList = [];

        logger.info(`Fetching all the questions`);
        response = await sendRequest(null, options, 'GET', APIURL, 'to get all the questions');
        logger.info('Successfully fetched all the questions');

        questionsList = response.map(({ name, id }) => {
            return { name, id };
        });

        if (questionsList.length === 0) {
            throw new Error('There is no question available for export');
        }

        const question = await prompt([
            {
                type: 'select',
                name: 'info',
                message: 'Please select the question:',
                result: (questionName) => {
                    let questionInfo;
                    questionsList.map(({ name, id }) => {
                        if (name === questionName) {
                            questionInfo = { id, name };
                        }
                    });
                    return questionInfo;
                },
                choices: questionsList.map(({ name }) => name),
            },
        ]);

        const {
            info: { id, name },
        } = question;

        logger.info(`User has selected ${name} question`);
        APIURL = `${global.credConfig.metabase.url}/api/card/${id}`;
        logger.info(`Fetching Info. about question ${name}`);
        response = await sendRequest(null, options, 'GET', APIURL, 'to get detailed information of selected question');
        logger.info(`Successfully fetched question ${name}`);

        fileName = `question_${name}_`;
        await storeResponse({ detailedInfo: response, basicInfo: question.info, type: 'Q', fileName });
    } catch (error) {
        logger.error(`${error.stack ? error.stack : error}`);
        if (error.name !== 'CredError' && error.message) throw new CredError(`${error.message}`);
        error.name = 'Metabase API call failed';
        throw new CredError('Question export failed');
    }
}

class ExportCommand extends Command {
    async run() {
        try {
            await validateCredConfig('metabase', 'Metabase not initialised.');

            logger.info('Checking user sesssion');
            let sessionID = await getMetabaseSessionID();
            logger.info(`Session check successful. Retrieved session id is : ${sessionID}`);

            const choice = await prompt([
                {
                    type: 'select',
                    name: 'main',
                    message: 'Please select one of the following:',
                    choices: ['Dashboard', 'Question'],
                },
            ]);

            if (choice.main === 'Dashboard') {
                logger.info(`Exporting metabase dashboard`);
                await exportDashboard({ sessionID });
            } else {
                logger.info(`Exporting metabase question`);
                await exportQuestion({ sessionID });
            }

            logger.info(`${choice.main} exported successfully`);
            this.console.log(`${chalk.greenBright(`${choice.main} exported successfully`)}`);
        } catch (error) {
            errorHandler(error, 'metabase');
        }
    }
}

ExportCommand.description = `Export metabase dashboard/question
`;

ExportCommand.flags = {};

module.exports = ExportCommand;
