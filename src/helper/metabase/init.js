/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable one-var */
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const initializeMetabase = async (url, username, password) => {
    let metabaseConfig = { metabase: { url, username, password } },
        configFileName = 'metacli_cfg.json',
        credcliConfig;

    configPath = path.resolve(os.homedir(), 'credence/metabase/', configFileName);

    credcliConfig = metabaseConfig;
    if (fs.existsSync(configPath) && path.extname(configPath) === '.json') {
        credcliConfig = await fs.readFile(configPath);
        credcliConfig = { ...JSON.parse(credcliConfig), ...metabaseConfig };
    }
    await fs.outputFile(configPath, JSON.stringify(credcliConfig, null, 2));
};

module.exports = { initializeMetabase };
