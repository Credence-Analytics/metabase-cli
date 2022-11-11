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
        directoryToExport = path.resolve('F:/credence/microservices');

    const dashboardList = [
        {
            "description": null,
            "archived": false,
            "collection_position": null,
            "ordered_cards": [
              {
                "sizeX": 4,
                "series": [],
                "collection_authority_level": null,
                "card": {
                  "query_average_duration": null
                },
                "updated_at": "2022-11-02T14:28:21.701",
                "col": 0,
                "id": 1,
                "parameter_mappings": [],
                "card_id": null,
                "visualization_settings": {
                  "virtual_card": {
                    "name": null,
                    "display": "text",
                    "visualization_settings": {},
                    "dataset_query": {},
                    "archived": false
                  },
                  "text": "Testing Text!"
                },
                "dashboard_id": 1,
                "created_at": "2022-11-02T14:27:55.773",
                "sizeY": 1,
                "row": 0
              }
            ],
            "param_values": null,
            "can_write": true,
            "enable_embedding": false,
            "collection_id": 2,
            "show_in_getting_started": false,
            "name": "Testing Dashboard",
            "caveats": null,
            "collection_authority_level": null,
            "creator_id": 1,
            "updated_at": "2022-11-02T14:28:21.748",
            "made_public_by_id": null,
            "embedding_params": null,
            "cache_ttl": null,
            "id": 1,
            "position": null,
            "param_fields": null,
            "last-edit-info": {
              "id": 1,
              "email": "shubhamyadav@credenceanalytics.com",
              "first_name": "Shubham",
              "last_name": "yadav",
              "timestamp": "2022-11-02T14:28:21.76"
            },
            "parameters": [],
            "created_at": "2022-11-02T14:26:35.662",
            "public_uuid": null,
            "points_of_interest": null
          }
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
