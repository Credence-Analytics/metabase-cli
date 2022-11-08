/* eslint-disable prettier/prettier */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable one-var */
/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable array-callback-return */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable dot-notation */
/* eslint-disable prefer-const */

const fs = require('fs-extra');
const { expect } = require('chai');
const path = require('path');
const chalk = require('chalk');

const { CredError } = require(path.join(__dirname, '../../../src/helper/logger.js'));
const { checkExistance, createOrUpdateQuestion, createOrUpdateDashboard } = require(path.join(__dirname, '../../../src/helper/metabase/import'));

describe('metabase import', () => {
    let queImpdata,
        resultQueList = [],
        resultDashList = [],
        queExistance = false,
        dashExistance = false,
        dashImpdata,
        queImpFilePath = path.resolve('F:/credence/microservices/question_people_test_2022-11-08_23_10_41.json'),
        dashImpFilePath = path.resolve('F:/credence/microservices/dashboard_with_textbox.json');

    const allMetabaseQuestionList = [
        {
            "description": null,
            "archived": false,
            "collection_position": null,
            "table_id": 3,
            "result_metadata": null,
            "creator": {
              "email": "shubhamyadav@credenceanalytics.com",
              "first_name": "Shubham",
              "last_login": "2022-11-08T23:10:39.355",
              "is_qbnewb": false,
              "is_superuser": true,
              "id": 1,
              "last_name": "yadav",
              "date_joined": "2022-10-31T17:03:58.969",
              "common_name": "Shubham yadav"
            },
            "can_write": true,
            "database_id": 2,
            "enable_embedding": false,
            "collection_id": 2,
            "query_type": "query",
            "name": "People test",
            "last_query_start": null,
            "dashboard_count": 0,
            "average_query_time": null,
            "creator_id": 1,
            "moderation_reviews": [],
            "updated_at": "2022-11-08T23:10:13.623",
            "made_public_by_id": 1,
            "embedding_params": null,
            "cache_ttl": null,
            "dataset_query": {
              "database": 2,
              "query": {
                "source-table": 3,
                "limit": 50
              },
              "type": "query"
            },
            "id": 5,
            "display": "table",
            "last-edit-info": {
              "id": 1,
              "email": "shubhamyadav@credenceanalytics.com",
              "first_name": "Shubham",
              "last_name": "yadav",
              "timestamp": "2022-11-08T23:10:13.599"
            },
            "visualization_settings": {
              "table.pivot_column": "SOURCE",
              "table.cell_column": "LONGITUDE"
            },
            "collection": {
              "authority_level": null,
              "description": null,
              "archived": false,
              "slug": "testing_collection",
              "color": "#509EE3",
              "name": "Testing collection",
              "personal_owner_id": null,
              "id": 2,
              "location": "/",
              "namespace": null
            },
            "created_at": "2022-11-08T23:10:13.579",
            "public_uuid": "68be14f9-b0f1-400c-b89a-3f917e38bd0c"
          }
    ];

    const allMetabaseDashboardList = [
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

    before(async () => {
        if (!fs.existsSync(queImpFilePath) || path.extname(queImpFilePath) !== '.json') {
            throw new CredError('Provided a valid path to the json file.', { suggestions: [`Run command ${chalk.yellowBright(`metabase import`)}`] });
        }
        queImpdata = JSON.parse(await fs.readFile(queImpFilePath));
        dashImpdata = JSON.parse(await fs.readFile(dashImpFilePath));
    });

    describe('Importing question', () => {
        it('Checking existance of the question', () => {
            queExistance = checkExistance(allMetabaseQuestionList, queImpdata);
            expect(allMetabaseQuestionList.map((x) => x.name).includes(queImpdata.data.name)).to.be.eq(!!queExistance);
        });

        it('Creating or updating the question', () => {
            resultQueList = createOrUpdateQuestion(queExistance, allMetabaseQuestionList, queImpdata);
            if (!!!queExistance) expect(resultQueList.length).to.be.gt(allMetabaseQuestionList.length);
            expect(resultQueList.find((x) => x.name === queImpdata.data.name).description).to.be.eq(queImpdata.data.description);
        });

        it('Checking publish status', () => {
            expect(resultQueList.find((x) => x.name === queImpdata.data.name).public_uuid).to.be.eq('9000');
        });
    });

    describe('Importing dashboard', () => {
        it('Checking existance of the dashboard', () => {
            dashExistance = checkExistance(allMetabaseDashboardList, dashImpdata);
            expect(allMetabaseDashboardList.map((x) => x.name).includes(dashImpdata.data.name)).to.be.eq(!!dashExistance);
        });

        it('Creating or updating the dashboard', () => {
            let result = createOrUpdateDashboard(dashExistance, allMetabaseDashboardList, dashImpdata, allMetabaseQuestionList);
            resultDashList = result['allMetabaseDashboardList'];
            resultQueList = result['allMetabaseQuestionList'];
            if (!!!dashExistance) expect(resultDashList.length).to.be.gt(allMetabaseDashboardList.length);
            expect(resultDashList.find((x) => x.name === dashImpdata.data.name)['parameters'].length).to.be.eq(dashImpdata.data['parameters'].length);
        });

        it('Tagging and publish status check of imported questions', () => {
            let questionInImpDash = dashImpdata.data['ordered_cards'].map((x) => x),
                recentImportedQuestions = [];
            questionInImpDash.map((questionName) => {
                recentImportedQuestions.push(resultQueList.find((x) => x.name === questionName.card.name));
            });
            expect(questionInImpDash.length).to.be.eq(recentImportedQuestions.length);
            recentImportedQuestions.forEach((element) => {
                expect(element['dashboard_id']).to.be.eq(dashImpdata.data.id);
                expect(element['public_uuid']).to.be.eq('9000');
            });
        });

        it('Checking dashboard publish status', () => {
            expect(resultDashList.find((x) => x.name === dashImpdata.data.name).public_uuid).to.be.eq('9000');
        });
    });
});
