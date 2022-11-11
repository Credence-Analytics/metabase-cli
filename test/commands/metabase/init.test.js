/* eslint-disable prettier/prettier */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable unicorn/prefer-optional-catch-binding */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable prefer-const */
const fs = require('fs-extra');
const { expect } = require('chai');
const path = require('path');
// const os = require('os');
const { initializeMetabase } = require(path.join(__dirname, '../../../src/helper/metabase/init'));

describe('metabase init', () => {
    let configFileName = 'metabasecli_cfg.json';
    const config = {
        url: 'http://127.0.0.1:3100',
        username: 'shubhamyadav@credenceanalytics.com',
        password: 'credence1',
    };
    describe('Should initialize the metabase', () => {
        it('Initializing metabase connnection', async () => {
            try {
                await initializeMetabase(config.url, config.username, config.password);
                // const configFile = await fs.readFile(path.resolve(os.homedir(), 'credence/metabase', configFileName));
                const configFile = await fs.readFile(path.resolve(__dirname, '../../..', configFileName));
                expect(JSON.parse(configFile).metabase.username).to.be.eq('shubhamyadav@credenceanalytics.com');
            } catch (error) {
                throw new Error('Error while validating metabase details');
            }
        });
    });

    after(async () => {
        await fs.remove(path.resolve('../../../', configFileName));
    });
});
