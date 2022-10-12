/* eslint-disable prefer-template */
/* eslint-disable prefer-const */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable eqeqeq */

const path = require('path');
const fs = require('fs');

let addMacroConfiguration = async (options) => {
    let configfiledata = '';
    let macrodata;

    configfiledata = fs.readFileSync(options.configfile, { encoding: 'utf8', flag: 'r' });
    configfiledata = JSON.parse(configfiledata);

    macrodata = configfiledata.macros.filter(function (m) {
        return m.name == options.macro;
    });
    if (macrodata.length > 0) {
        return `macro ${options.macro} already exists`;
    }
    configfiledata.macros.push({ name: options.name, route: options.route, label: options.label, app: options.app, jsfile: path.join('/macros/', options.macro, options.macro + '.js') });
    // overwrite the macro config json with new configs
    fs.writeFileSync(options.configfile, JSON.stringify(configfiledata), { encoding: 'utf8', flag: 'w' });

    // create the macro folder
    fs.mkdirSync(path.join(options.folder, options.macro));
    // create the macro file
    fs.writeFileSync(
        path.join(options.folder, options.macro, options.macro + '.js'),
        `(function(m) {
          function dosomething() {
              /*...write your code here */ 
          } 
          m.register('${options.macro}',  dosomething) 
        })(_macro)
    `,
        { encoding: 'utf8', flag: 'w' }
    );
    return `Macro ${options.macro} created successfully.`;
};

const initCredConfig = () => {
    if (!fs.existsSync(path.join(global.CREDCLI_PATH, 'credcli_cfg.json'))) {
        const config = {
            appbuilder: {},
            pagebuilder: {},
            metabase: {},
        };
        fs.writeFileSync(path.join(global.CREDCLI_PATH, 'credcli_cfg.json'), JSON.stringify(config, null, 2));
    }
    return path.join(global.CREDCLI_PATH, 'credcli_cfg.json');
};

module.exports = { addMacroConfiguration, initCredConfig };
