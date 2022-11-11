/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable no-useless-catch */
/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable one-var */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-dynamic-require */

const fs = require('fs-extra');
const { expect } = require('chai');
const path = require('path');

const { deleteDashboardOrQuestion } = require(path.join(__dirname, '../../../src/helper/metabase/delete'));

describe('metabase delete', () => {
    // It should be either D (Dashboard) or Q (Question)
    let existingQuestionList = [
            { id: 1, name: 'First question', description: 'This is first question' },
            { id: 2, name: 'Second question', description: 'This is Second question' },
        ],
        existingDashboardList = [
            { id: 1, name: 'First dashboard', description: 'This is first dashboard' },
            { id: 2, name: 'Second dashboard', description: 'This is Second dashboard' },
        ],
        deletitionOption = `D`,
        resultAfterDeletion,
        dashboardOrQuestionName,
        confirmDeletion = 'No';

    describe('Should delete dashboard/question', () => {
        it('Deleting dashboard/question', async () => {
            try {
                listOfDashOrQue = deletitionOption === 'Q' ? existingQuestionList : existingDashboardList;
                /* 
                if deletionOption is D then enter any valid name from existingDashboardList
                otherwise enter any valid name from the existingQuestionList array.
                */
                dashboardOrQuestionName = 'First dashboard';
                confirmDeletion = 'Yes';
                resultAfterDeletion = await deleteDashboardOrQuestion(listOfDashOrQue, dashboardOrQuestionName, confirmDeletion);
                if (confirmDeletion === 'Yes') {
                    expect(resultAfterDeletion.length).to.be.lt(listOfDashOrQue.length);
                    expect(resultAfterDeletion.find((x) => x.name === dashboardOrQuestionName)).to.be.eq(undefined);
                    return;
                }
                expect(resultAfterDeletion.length).to.be.eq(listOfDashOrQue.length);
                expect(resultAfterDeletion.find((x) => x.name === dashboardOrQuestionName).name).to.be.eq(dashboardOrQuestionName);
            } catch (error) {
                throw error;
            }
        });

        it('Deleting if the list of existing dashboard/question is empty', async () => {
            try {
                listOfDashOrQue = [];
                dashboardOrQuestionName = 'First question';
                confirmDeletion = 'Yes';
                resultAfterDeletion = await deleteDashboardOrQuestion(listOfDashOrQue, dashboardOrQuestionName, confirmDeletion);
            } catch (error) {
                expect(error.message).to.be.eq('There is no item available for delete');
            }
        });
    });
});
