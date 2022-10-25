/* eslint-disable prettier/prettier */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-useless-catch */
/* eslint-disable prefer-const */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable one-var */

const fs = require('fs-extra');
const { expect } = require('chai');
const path = require('path');
const os = require('os');

const { exportDashboard, exportQuestion } = require(path.join(__dirname, '../../../src/helper/metabase/export'));

describe('metabase export', () => {
    let exportedFileName,
        directoryToExport = path.resolve(os.homedir(), 'credence/metabase-cli');

    const dashboardList = [
        {
            description: null,
            archived: false,
            collection_position: null,
            ordered_cards: [],
            param_values: null,
            can_write: true,
            enable_embedding: false,
            collection_id: 1,
            show_in_getting_started: false,
            name: 'testing-dashboard',
            caveats: null,
            collection_authority_level: null,
            creator_id: 1,
            updated_at: '2022-10-25T15:17:05.579',
            made_public_by_id: null,
            embedding_params: null,
            cache_ttl: null,
            id: 1,

            position: null,
            param_fields: null,
            'last-edit-info': {
                id: 1,
                email: 'hamzashaikh@crdenceanalytics.com',
                first_name: 'Hamza',
                last_name: 'Shaikh',
                timestamp: '2022-10-25T15:17:05.582',
            },
            parameters: [],
            created_at: '2022-10-13T14:46:50.924',
            public_uuid: null,
            points_of_interest: null,
        },
    ];

    const questionList = [{ id: 1, name: 'testing-question', description: null }];

    describe('Should export dashboard/question', () => {
        it('Exporting dashboard', async () => {
            try {
                // Do not set this id 0 or greater that the length of the dashboardList because that is not possible to select in
                // prompt given to the user.
                const dashboardId = 1;

                exportedFileName = await exportDashboard(dashboardList, dashboardId, directoryToExport);
                const exportedDashboard = JSON.parse(await fs.readFile(path.resolve(directoryToExport, exportedFileName)));
                console.log(directoryToExport);
                expect(exportedDashboard.data.name).to.be.eq(dashboardList.find((x) => x.id === dashboardId).name);
            } catch (error) {
                throw error;
            }
        });

        it('Exporting question', async () => {
            try {
                // Do not set this id 0 or greater that the length of the questionList because that is not possible to select in
                // prompt given to the user.
                const questionId = 1;

                exportedFileName = await exportQuestion(questionList, questionId, directoryToExport);
                const exportedDashboard = JSON.parse(await fs.readFile(path.resolve(directoryToExport, exportedFileName)));
                expect(exportedDashboard.data.name).to.be.eq(questionList.find((x) => x.id === questionId).name);
            } catch (error) {
                throw error;
            }
        });

        it('Exporting question if questionList is empty', async () => {
            try {
                // Do not set this id 0 or greater that the length of the questionList because that is not possible to select in
                // prompt given to the user.
                const questionId = 1;
                exportedFileName = await exportQuestion([], questionId, directoryToExport);
            } catch (error) {
                expect(error.message).to.be.equals('There is no question available for export');
            }
        });

        it('Exporting dashboard if dashboardList is empty', async () => {
            try {
                // Do not set this id 0 or greater that the length of the questionList because that is not possible to select in
                // prompt given to the user.
                const dashboardID = 1;
                exportedFileName = await exportDashboard([], dashboardID, directoryToExport);
            } catch (error) {
                expect(error.message).to.be.equals('There is no dashboard available for export');
            }
        });
    });

    afterEach(async () => {
        await fs.remove(exportedFileName);
    });
});
