/* eslint-disable consistent-return */
/* eslint-disable dot-notation */
/* eslint-disable array-callback-return */
/* eslint-disable one-var */
/* eslint-disable prefer-const */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable unicorn/prefer-module */
const { Command } = require('@oclif/core');
const path = require('path');
const { prompt } = require('enquirer');
const { cli } = require('cli-ux');
const chalk = require('chalk');

const util = require(path.join(__dirname, '../util.js'));
const { setConsoleLog, initLogger, CredError } = require(path.join(__dirname, '../helper/logger.js'));

const logger = initLogger();
const { sendRequest, validateCredConfig, getMetabaseSessionID } = require(path.join(__dirname, '../helper/api-utils.js'));
setConsoleLog(Command);

async function deleteDashboardOrQuestion({ sessionID, flag }) {
    try {
        let APIURL = flag === 'Q' ? `${global.credConfig.metabase.url}/api/card` : `${global.credConfig.metabase.url}/api/dashboard`,
            options = {
                headers: {
                    'X-Metabase-Session': sessionID,
                },
            },
            itemList = [],
            itemname = flag === 'Q' ? 'question' : 'dashboard',
            response;

        logger.info(`Fetching all the ${itemname}s`);
        response = await sendRequest(null, options, 'GET', APIURL, `to get all the ${itemname}s`);
        logger.info(`Successfully fetched all the ${itemname}s`);

        itemList = response.map(({ name, id }) => {
            return { name, id };
        });

        if (itemList.length === 0) {
            throw new Error(`There is no ${itemname} available for delete`);
        }

        const questionOrDashboard = await prompt([
            {
                type: 'select',
                name: 'info',
                message: `Please select the ${itemname}:`,
                result: (questionName) => {
                    let questionInfo;
                    itemList.map(({ name, id }) => {
                        if (name === questionName) {
                            questionInfo = { id, name };
                        }
                    });
                    return questionInfo;
                },
                choices: itemList.map(({ name }) => name),
            },
        ]);

        const {
            info: { id, name: dashboardOrQuestionName },
        } = questionOrDashboard;

        logger.info(`User has selected ${itemname} : ${dashboardOrQuestionName} `);

        const confirm = await prompt([
            {
                type: 'select',
                name: 'answer',
                message: `Are you sure you want to delete ${itemname} : ${dashboardOrQuestionName} ?`,
                choices: ['No', 'Yes'],
            },
        ]);

        if (confirm.answer === "No") return;

        APIURL = flag === "Q" ? `${global.credConfig.metabase.url}/api/card/${id}` : `${global.credConfig.metabase.url}/api/dashboard/${id}`;
        logger.info(`Deleting ${itemname} : ${dashboardOrQuestionName}`);

        cli.action.start(`${chalk.greenBright(' ')} Processing request to delete ${itemname} : ${dashboardOrQuestionName.length > 25 ? `${dashboardOrQuestionName.slice(0, 25)}...   ` : dashboardOrQuestionName}`, '', { stdout: true });
        await sendRequest(null, options, 'DELETE', APIURL, `Processing request to delete ${itemname} : ${dashboardOrQuestionName.length > 25 ? `${dashboardOrQuestionName.slice(0, 25)}...   ` : dashboardOrQuestionName}`);
        cli.action.stop('Done');

        if (!response.ok) {
            throw new Error(`Failed to delete ${itemname}`);
        }

        logger.info(`Successfully deleted ${itemname} : ${dashboardOrQuestionName}`);
        return dashboardOrQuestionName;
    } catch (error) {
        if (error.name !== 'CredError' && error.message) throw new CredError(`${error.message}`);
        error.name = 'Metabase API call failed';
        logger.error(`${error.stack ? error.stack : error}`);
        throw new CredError(`Failed to delete!`);
    }
}

class DeleteCommand extends Command {
    async run() {
        try {
            let sessionID, flag, deletedItemName, finalLogMsg;

            await validateCredConfig('metabase', 'Metabase not initialised.');

            logger.info('Checking user sesssion');
            sessionID = await getMetabaseSessionID();
            logger.info(`Session check successful. Retrieved session id is : ${sessionID}`);

            const choice = await prompt([
                {
                    type: 'select',
                    name: 'main',
                    message: 'Please select one of the following:',
                    choices: ['Dashboard', 'Question'],
                },
            ]);

            logger.info(`Deleting metabase ${choice.main.toLowerCase()}`);
            flag = choice.main === 'Dashboard' ? 'D' : 'Q';
            deletedItemName = await deleteDashboardOrQuestion({ sessionID, flag });

            finalLogMsg = deletedItemName ? `${choice.main} : ${deletedItemName} deleted successfully.` : 'Aborted deletion.';
            logger.info(finalLogMsg);
            this.console.log(finalLogMsg);
        } catch (error) {
            util.errorHandler(error);
        }
    }
}

DeleteCommand.description = `Delete metabase dashboard/question
`;

DeleteCommand.flags = {};

module.exports = DeleteCommand;
