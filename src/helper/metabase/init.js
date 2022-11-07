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
        configFileName = 'metacli_cfg.json',
        metacliConfig;

    // configPath = path.resolve(os.homedir(), '.credcli', configFileName);
    configPath = path.resolve(__dirname, '../../..', configFileName);

    metacliConfig = metabaseConfig;
    if (fs.existsSync(configPath) && path.extname(configPath) === '.json') {
        metacliConfig = await fs.readFile(configPath);
        metacliConfig = { ...JSON.parse(metacliConfig), ...metabaseConfig };
    }
    await fs.outputFile(configPath, JSON.stringify(metacliConfig, null, 2));
};

module.exports = { initializeMetabase };
