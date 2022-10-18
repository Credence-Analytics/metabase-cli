const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const moment = require('moment');
const { initLogger, CredError } = require(path.join(__dirname, '../../helper/logger.js'));
const logger = initLogger('metabase');

function formatDate(dateObj, dateFormat) {
    return moment(dateObj).format(dateFormat);
}

async function storeResponse(response, payload, type, fileName, directoryPath) {
    let dateObj = new Date(),
        finalFileName = `${fileName.toLowerCase()}${formatDate(dateObj, 'YYYY-MM-DD HH:mm:ss')}.json`.split(' ').join('_'),
        finalResponse = {
            date: formatDate(dateObj, 'YYYY-MM-DD'),
            type,
            typename: payload.name,
            data: response
        },
        responseFilePath;

    if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
        logger.info(`Provided directory : ${directoryPath} is not valid. Stopping the export...`);
        throw new Error(`Provided directory : ${directoryPath} is not valid.`);
    }

    responseFilePath = path.join(directoryPath, finalFileName);

    logger.info(`Storing ${type === 'D' ? 'dashboard' : 'question'} data ${JSON.stringify(finalResponse)} to ${responseFilePath} file\n`);

    await fs.outputFile(responseFilePath, JSON.stringify(finalResponse, null, 2));
    logger.info(`Successfully stored ${type === 'D' ? 'dashboard' : 'question'} in ${chalk.greenBright(responseFilePath)} file`);
    return path.resolve(directoryPath, finalFileName);
}

const exportDashboard = async (dashboardList, selectedDashId, exportDirectory) => {
    let fileName;
    if (dashboardList.length === 0) throw new Error("There is no dashboard available for export")
    const selectedDashboard = dashboardList.find((x) => x.id === selectedDashId);
    fileName = `dashboard_${selectedDashboard.name}_`;
    return await storeResponse(selectedDashboard, { name: selectedDashboard.name }, "D", fileName, exportDirectory)
}

const exportQuestion = async (questionList, selectedQueId, exportDirectory) => {
    let fileName;
    if (questionList.length === 0) throw new Error("There is no question available for export")
    const selectedQuestion = questionList.find((x) => x.id === selectedQueId);
    fileName = `question_${selectedQuestion.name}_`;
    return await storeResponse(selectedQuestion, { name: selectedQuestion.name }, "Q", fileName, exportDirectory)
}

module.exports = { exportDashboard, exportQuestion }