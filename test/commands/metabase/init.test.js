/* eslint-disable prettier/prettier */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable unicorn/prefer-optional-catch-binding */
/* eslint-disable prefer-const */

const fs = require('fs-extra');
const { expect } = require('chai');
const path = require('path');
const os = require('os');

// const { validatePath, checkWritePermission } = require(path.join(__dirname, '../../../src/helper/patch/utils.js'));
const { initializeMetabase } = require(path.join(__dirname, '../../../src/helper/metabase/init'));

describe('metabase init', () => {
    let configFileName = 'metacli_cfg.json';
    const config = {
        url: 'http://localhost:3100',
        username: 'jayavaiya@credenceanalytics.com',
        password: 'dFJZ2yj8Qdm63dg',
    };
    describe('Should initialize the metabase', () => {
        it('Initializing metabase connnection', async () => {
            try {
                await initializeMetabase(config.url, config.username, config.password);
                const configFile = await fs.readFile(path.resolve(os.homedir(), 'credence/metabase/', configFileName));
                expect(JSON.parse(configFile).metabase.username).to.be.eq('jayavaiya@credenceanalytics.com');
            } catch (error) {
                throw new Error('Error while validating metabase details');
            }
        });
    });

    after(async () => {
        await fs.remove(path.resolve(os.homedir(), 'credence/metabase/', configFileName));
    });
});
