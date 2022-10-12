/* eslint-disable no-undef */
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
const { prompt } = require('enquirer');
const chalk = require('chalk');
const _ = require('lodash');
const { cli } = require('cli-ux');
const Table = require('cli-table3');

const { CredError, initLogger } = require(path.join(__dirname, './logger.js'));
const logger = initLogger('commands');

async function validateCredConfig(commandName, message = null) {
    if (global.credConfig && global.credConfig[commandName] && !(Object.keys(global.credConfig[commandName]).length > 0)) {
        throw new CredError((message && message.toString()) || 'Config data is not present.', { suggestions: [`Run command ${chalk.yellowBright(`credcli ${commandName}:init`)}`] });
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

async function sendRequest(route, options, method = 'POST', APIURL, label = '') {
    try {
        cli.action.start(`${chalk.greenBright(' ')} Processing request ${label}`, '', { stdout: true });

        options.method = method;
        options.headers['Content-Type'] = 'application/json';
        if (method === 'GET') {
            delete options.body;
        }

        if (APIURL && new URL(APIURL).protocol === 'https:') {
            options.httpsAgent = new https.Agent({
                rejectUnauthorized: false,
            });
        }

        const url = APIURL || global.credConfig.appbuilder.API_URL + route;
        logger.info(`API: ${url}`);
        logger.info(`Method: ${method}`);
        logger.info(`Header: ${JSON.stringify(options.headers)}`);
        logger.info(`Body: ${options.body}`);
        const apiResponse = await fetch(url, options);
        const jsonResponse = await apiResponse.json();
        logger.info(`Response: ${JSON.stringify(jsonResponse)}`);
        cli.action.stop('Done');
        return jsonResponse;
    } catch (error) {
        throw new CredError(error);
    }
}

async function printResult(response) {
    if (response.status === 'success') {
        this.console.log(`Success! Request completed with ID: ${chalk.greenBright(response.ID)}`);
    } else {
        throw new CredError(JSON.stringify(response));
    }
}

async function getCollectionsmetaRead(id = '') {
    const options = {
        headers: { sessionid: global.credConfig.appbuilder.sessionid },
    };
    options.body = JSON.stringify({
        filter: [{ field: 'HIDE', value: 'N' }],
        sort: {
            field: 'TITLE',
        },
    });
    const response = await sendRequest(`/appbuilder/collectionsmeta/read/${id}`, options);

    return response;
}

async function selectApp() {
    const options = {
        body: JSON.stringify({
            filter: [],
            sort: {
                field: 'NAME',
            },
        }),
        headers: { sessionid: global.credConfig.appbuilder.sessionid },
    };

    const response = await sendRequest('/appbuilder/apps/read?', options);
    const apps = _.compact(_.map(response, 'NAME'));
    if (apps.length === 0) {
        return { data: false };
    }
    const appChoice = await prompt([
        {
            type: 'autocomplete',
            name: 'main',
            limit: 10,
            message: 'Enter name of the app',
            choices: apps,
        },
    ]);
    const selected = _.find(response, { NAME: appChoice.main });
    return { data: true, selected };
}

async function selectPage() {
    const options = {
        body: JSON.stringify({
            filter: [],
            sort: {
                field: 'PAGENAME',
            },
        }),
        headers: { sessionid: global.credConfig.pagebuilder.sessionid },
    };
    const URL = `${global.credConfig.pagebuilder.API_URL}/pagebuilder/page/read?`;
    const response = await sendRequest('/pagebuilder/page/read?', options, 'POST', URL);
    const pages = _.compact(_.map(response, 'PAGENAME'));
    if (pages.length === 0) {
        return { data: false };
    }
    const appChoice = await prompt([
        {
            type: 'autocomplete',
            name: 'main',
            limit: 10,
            message: 'Enter name of the page',
            choices: pages,
        },
    ]);
    const selected = _.find(response, { PAGENAME: appChoice.main });
    return { data: true, selected };
}

async function selectSection() {
    const page = await selectPage();
    if (!page.data) {
        this.console.log('No data present');
    }

    const options = {
        body: JSON.stringify({
            filter: [],
            sort: {
                field: 'PAGESECTIONNAME',
            },
        }),
        headers: { sessionid: global.credConfig.pagebuilder.sessionid },
    };
    const URL = `${global.credConfig.pagebuilder.API_URL}/pagebuilder/page/read/${page.selected.PAGEID}`;
    const response = await sendRequest(`/pagebuilder/page/read/${page.selected.PAGEID}`, options, 'POST', URL);
    const sections = _.compact(_.map(response.data.section, 'PAGESECTIONNAME'));
    if (sections.length === 0) {
        return { data: false };
    }
    const appChoice = await prompt([
        {
            type: 'autocomplete',
            name: 'main',
            limit: 10,
            message: 'Enter name of the section',
            choices: sections,
        },
    ]);
    const selected = _.find(response.data.section, { PAGESECTIONNAME: appChoice.main });
    return { data: true, selected };
}
async function displayPage() {
    const options = {
        body: JSON.stringify({
            filter: [],
            // sort: {
            //     field: 'PAGEID'
            // }
        }),
        headers: { sessionid: global.credConfig.pagebuilder.sessionid },
    };
    const URL = `${global.credConfig.pagebuilder.API_URL}/pagebuilder/page/read?`;
    const response = await sendRequest('/pagebuilder/page/read?', options, 'POST', URL);
    const table = new Table({
        head: ['PAGEID', 'PAGENAME'].map((item) => chalk.greenBright(item)),
        // colWidths: [''],
        wordWrap: true,
    });
    for (let i = 0; i < response.length; i++) {
        table.push([response[i].PAGEID, response[i].PAGENAME]);
    }
    return { data: true, table };
}

async function selectAppCollection(app) {
    const options = {
        body: ``,
        headers: { sessionid: global.credConfig.appbuilder.sessionid },
    };
    const response = await sendRequest(`/appbuilder/apps/read/${app.ID}`, options);
    const collectionList = _.compact(_.map(response.COLLECTIONS, 'TITLE'));

    if (collectionList.length === 0) {
        return { data: false };
    }
    const appChoice = await prompt([
        {
            type: 'autocomplete',
            limit: 10,
            name: 'main',
            message: 'Enter name of the collection',
            choices: collectionList,
        },
    ]);
    const selected = _.find(response.COLLECTIONS, { TITLE: appChoice.main });
    return { data: true, selected };
}

async function selectGroup(app) {
    const options = {
        body: ``,
        headers: { sessionid: global.credConfig.appbuilder.sessionid },
    };
    const response = await sendRequest(`/appbuilder/apps/read/${app.ID}`, options);
    const groupList = _.compact(_.map(response.GROUPS, 'NAME'));
    if (groupList.length === 0) {
        return { data: false };
    }
    const appChoice = await prompt([
        {
            type: 'autocomplete',
            limit: 10,
            name: 'main',
            message: 'Enter name of the group',
            choices: groupList,
        },
    ]);
    const selected = _.find(response.GROUPS, { NAME: appChoice.main });
    return { data: true, selected };
}

async function selectCollection() {
    const response = await getCollectionsmetaRead();
    const collections = _.compact(_.map(response, 'TITLE'));
    if (collections.length === 0) {
        return { data: false };
    }
    const collectionChoice = await prompt([
        {
            type: 'autocomplete',
            limit: 10,
            name: 'main',
            message: 'Enter name of the collection',
            choices: collections,
        },
    ]);
    const selected = _.find(response, { TITLE: collectionChoice.main });
    return { data: true, selected };
}

async function selectField(selectedCollection) {
    const response = await getCollectionsmetaRead(selectedCollection.ID);
    const fieldList = _.compact(_.map(response.FIELDS, 'LABEL'));
    // this.console.log(chalk.greenBright('Collection Fields'));
    if (fieldList.length === 0) {
        return { data: false };
    }
    const fieldChoice = await prompt([
        {
            type: 'autocomplete',
            limit: 10,
            name: 'main',
            message: 'Enter name of the field',
            choices: fieldList,
        },
    ]);
    const selected = _.find(response.FIELDS, { LABEL: fieldChoice.main });
    return { data: true, selected };
}

module.exports = { sendRequest, getCollectionsmetaRead, selectApp, selectGroup, selectAppCollection, selectField, selectCollection, printResult, selectPage, selectSection, displayPage, validateCredConfig, getMetabaseSessionID };
