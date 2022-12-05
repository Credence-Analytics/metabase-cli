/* eslint-disable unicorn/no-for-loop */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable one-var */
/* eslint-disable no-useless-catch */
/* eslint-disable unicorn/explicit-length-check */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const fetch = require('node-fetch');
const chalk = require('chalk');
const { cli } = require('cli-ux');
const https = require('https');

const { CredError, initLogger } = require(path.join(__dirname, './logger.js'));
const logger = initLogger();

async function validateCredConfig(commandName, message = null) {
    if (global.credConfig && global.credConfig[commandName] && !(Object.keys(global.credConfig[commandName]).length > 0)) {
        throw new CredError((message && message.toString()) || 'Config data is not present.', { suggestions: [`Run command ${chalk.yellowBright(`metabase init`)}`] });
    }
}

async function getMetabaseSessionID() {
    try {
        let APIURL, payload, options, response;
        const {
            credConfig: {
                metabase: { username, password, url: metabase_url },
            },
        } = global;

        APIURL = `${metabase_url}/api/session`;
        payload = { username, password };
        options = {
            body: JSON.stringify(payload),
            headers: {},
        };

        response = await sendRequest(null, options, 'POST', APIURL, 'to check user session');
        if (response.hasOwnProperty('errors')) throw new CredError('Error while validating metabase details');
        return response.id;
    } catch (error) {
        throw error;
    }
}

async function sendRequest(route, options, method = 'POST', APIURL, label = "", addHeaders = true) {
    try {
        let jsonResponse = {};
        cli.action.start(`${chalk.greenBright(' ')} Processing request ${label}`, '', { stdout: true });

        options.method = method;
        if (addHeaders) {
            options.headers['Content-Type'] = 'application/json';
        }
        if (method === 'GET') {
            delete options.body;
        }

        if (APIURL && new URL(APIURL).protocol === "https:") {
            options.agent = new https.Agent({
                rejectUnauthorized: false
            });
        }

        const url = APIURL;
        logger.info(`API: ${url}`);
        logger.info(`Method: ${method}`);
        logger.info(`Header: ${JSON.stringify(options.headers)}`);
        logger.info(`Body: ${options.body}`);
        const apiResponse = await fetch(url, options);
        if (addHeaders) {
            jsonResponse = await apiResponse.json();
            logger.info(`Response: ${JSON.stringify(jsonResponse)}`);
        }
        cli.action.stop('Done');
        return jsonResponse;
    } catch (error) {
        throw new CredError(error);
    }
}

module.exports = { sendRequest, validateCredConfig, getMetabaseSessionID };
