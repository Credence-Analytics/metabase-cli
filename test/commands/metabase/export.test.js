/* eslint-disable prettier/prettier */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-useless-catch */
/* eslint-disable one-var */
/* eslint-disable prefer-const */
/* eslint-disable import/newline-after-import */
/* eslint-disable unicorn/prefer-module */
const fs = require('fs-extra');
const { expect } = require('chai');
const path = require('path');
const { exportDashboard, exportQuestion } = require(path.join(__dirname, '../../../src/helper/metabase/export'));

describe('metabase export', () => {
    let exportedFileName,
        directoryToExport = path.resolve('./');

    const dashboardList = [
        {
            description: 'This dashboard manages all the assets.',
            archived: false,
            collection_position: null,
            ordered_cards: [],
            param_values: null,
            can_write: true,
            enable_embedding: false,
            collection_id: 1,
            show_in_getting_started: false,
            name: 'Assets Dashboard',
            caveats: null,
            collection_authority_level: null,
            creator_id: 1,
            updated_at: '2022-09-19T17:21:00',
            made_public_by_id: null,
            embedding_params: null,
            cache_ttl: null,
            id: 3,
            position: null,
            param_fields: null,
            'last-edit-info': {
                id: 1,
                email: 'jayavaiya@credenceanalytics.com',
                first_name: 'Jay ',
                last_name: 'Avaiya',
                timestamp: '2022-09-19T17:20:59',
            },
            parameters: [],
            created_at: '2022-09-19T17:21:00',
            public_uuid: null,
            points_of_interest: null,
        },
        {
            description: null,
            archived: false,
            collection_position: null,
            param_values: null,
            can_write: true,
            enable_embedding: false,
            collection_id: 1,
            show_in_getting_started: false,
            name: 'Portfolio Dashboard',
            caveats: null,
            collection_authority_level: null,
            creator_id: 1,
            updated_at: '2022-09-16T16:23:20',
            made_public_by_id: null,
            embedding_params: null,
            cache_ttl: null,
            id: 2,
            position: null,
            param_fields: null,
            'last-edit-info': {
                id: 1,
                email: 'jayavaiya@credenceanalytics.com',
                first_name: 'Jay ',
                last_name: 'Avaiya',
                timestamp: '2022-09-16T16:23:20',
            },
            parameters: [],
            created_at: '2022-09-16T16:06:47',
            public_uuid: null,
            points_of_interest: null,
        },
    ];

    const questionList = [
        { id: 1, name: 'First question', description: 'This is first question' },
        { id: 2, name: 'Second question', description: 'This is Second question' },
    ];

    describe('Should export dashboard/question', () => {
        it('Exporting dashboard', async () => {
            try {
                // Do not set this id 0 or greater that the length of the dashboardList because that is not possible to select in
                // prompt given to the user.
                const dashboardId = 2;

                exportedFileName = await exportDashboard(dashboardList, dashboardId, directoryToExport);
                const exportedDashboard = JSON.parse(await fs.readFile(path.resolve(directoryToExport, exportedFileName)));
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
