/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable one-var */
/* eslint-disable prefer-const */
const fs = require('fs-extra');
const path = require('path');
// const os = require('os');

const initializeMetabase = async (url, username, password) => {
    let metabaseConfig = { metabase: { url, username, password } },
        configFileName = 'metabasecli_cfg.json',
        metabasecliConfig;

    configPath = path.resolve(__dirname, '../../..', configFileName);

    metabasecliConfig = metabaseConfig;
    if (fs.existsSync(configPath) && path.extname(configPath) === '.json') {
        metabasecliConfig = await fs.readFile(configPath);
        metabasecliConfig = { ...JSON.parse(metabasecliConfig), ...metabaseConfig };
    }
    await fs.outputFile(configPath, JSON.stringify(metabasecliConfig, null, 2));
};

module.exports = { initializeMetabase };
