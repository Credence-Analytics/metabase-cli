/* eslint-disable prefer-const */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable unicorn/prefer-optional-catch-binding */
/* eslint-disable no-new */
/* eslint-disable dot-notation */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-useless-escape */
/* eslint-disable unicorn/better-regex */
/* eslint-disable camelcase */
/* eslint-disable unicorn/prefer-module */
// import { Command } from '@oclif/core';
// import path from 'path';
// import { prompt } from 'enquirer';
// import * as fs from 'fs';
// import chalk from 'chalk';
const { Command } = require('@oclif/core');
const path = require('path');
const { prompt } = require('enquirer');
const chalk = require('chalk');
const fs = require('fs');

const { errorHandler } = require(path.join(__dirname, '../helper/patch/utils.js'));

const util = require(path.join(__dirname, '../util.js'));

const { setConsoleLog, initLogger, CredError } = require(path.join(__dirname, '../helper/logger.js'));

const logger = initLogger('metabase');
const { sendRequest } = require(path.join(__dirname, '../helper/api-utils.js'));
setConsoleLog(Command);

async function checkUserSession(metabase_url) {
    try {
        let APIURL = `${metabase_url}/api/session`;
        let payload;
        let options;
        let response;

        const username = await prompt([
            {
                type: 'input',
                name: 'value',
                message: 'Enter metabase registered emailid',
                result: (input) => {
                    return input.trim();
                },
                validate: (input) => {
                    let trimmedInput = input.trim();
                    let emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    if (trimmedInput !== '' && emailRegExp.test(trimmedInput)) return true;
                    return 'Email is not valid';
                },
            },
        ]);
        const password = await prompt([
            {
                type: 'password',
                name: 'value',
                message: 'Enter metabase password',
                result: (input) => {
                    return input.trim();
                },
                validate: (input) => {
                    if (input.trim() !== '') return true;
                    return 'Password is not valid';
                },
            },
        ]);

        payload = { username: username.value, password: password.value };
        options = {
            body: JSON.stringify(payload),
            headers: {},
        };

        logger.info(`Checking user session`);
        response = await sendRequest(null, options, 'POST', APIURL, 'to check user session');

        if (response.hasOwnProperty('errors')) throw new CredError(JSON.stringify(response['errors']));
        logger.info(`Session check successful`);
        return payload;
    } catch (error) {
        logger.error(`${error.stack ? error.stack : error}`);
        if (error.name !== 'CredError' && error.message) throw new CredError(`${error.message}`);
        error.name = 'Metabase API call failed';
        throw new CredError('Error while validating metabase details');
    }
}

class InitCommand extends Command {
    async run() {
        try {
            let configPath;

            const metabase = await prompt([
                {
                    type: 'input',
                    name: 'url',
                    message: 'Please enter metabase API url',
                    default: 'http://<ip>:<port>',
                    result: (input) => {
                        return input;
                    },
                    validate: (input) => {
                        try {
                            new URL(input.toString());
                            if (input.trim() !== '' && input.trim() !== 'http://<ip>:<port>') return true;
                            return 'Not a valid url';
                        } catch (error) {
                            return 'Not a valid url';
                        }
                    },
                },
            ]);

            const { url } = metabase;
            const { username, password } = await checkUserSession(url);

            // logger.info(`Writing ${JSON.stringify(metabaseConfig)} to the metabase config file`);

            configPath = util.initCredConfig();

            global.credConfig.metabase = { url, username, password };
            await fs.writeFileSync(configPath, JSON.stringify(global.credConfig, null, 2));
            logger.info(`Config file saved at ${configPath}`);
            this.console.log(`Config file saved at ${chalk.greenBright(configPath)}`);
        } catch (error) {
            errorHandler(error, 'metabase');
        }
    }
}

InitCommand.description = `Initialize metabase configurations
`;

module.exports = InitCommand;
