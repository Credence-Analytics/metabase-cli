/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
/* eslint-disable unicorn/prefer-module */

async function deleteDashboardOrQuestion(listOfDashOrQue, dashboardOrQuestionName, confirmDeletion = 'No') {
    try {
        if (listOfDashOrQue.length === 0) throw new Error(`There is no item available for delete`);
        if (listOfDashOrQue.findIndex((x) => x.name === dashboardOrQuestionName) < 0) throw new Error('Enter right dashboard or question name');
        if (confirmDeletion === 'No') return listOfDashOrQue;
        return listOfDashOrQue.filter((item) => item.name !== dashboardOrQuestionName);
    } catch (error) {
        throw error;
    }
}

module.exports = { deleteDashboardOrQuestion };
