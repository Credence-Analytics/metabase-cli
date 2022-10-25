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
        queImpFilePath = path.resolve('question_testing-question_2022-10-25_17_14_37.json'),
        dashImpFilePath = path.resolve('dashboard_bsjd_2022-10-25_17_18_31.json');

    const allMetabaseQuestionList = [
        {
            description: null,
            archived: false,
            collection_position: null,
            table_id: null,
            result_metadata: [
                {
                    name: 'ID',
                    display_name: 'ID',
                    base_type: 'type/BigInteger',
                    effective_type: 'type/BigInteger',
                    field_ref: [
                        'field',
                        'ID',
                        {
                            'base-type': 'type/BigInteger',
                        },
                    ],
                    semantic_type: 'type/PK',
                    fingerprint: null,
                },
                {
                    name: 'TOTAL',
                    display_name: 'TOTAL',
                    base_type: 'type/Float',
                    effective_type: 'type/Float',
                    field_ref: [
                        'field',
                        'TOTAL',
                        {
                            'base-type': 'type/Float',
                        },
                    ],
                    semantic_type: null,
                    fingerprint: {
                        global: {
                            'distinct-count': 1494,
                            'nil%': 0,
                        },
                        type: {
                            'type/Number': {
                                min: 13.703915846433869,
                                q1: 52.16498672761125,
                                q3: 110.74896236179433,
                                max: 159.34900526552292,
                                sd: 34.41222590732287,
                                avg: 81.33739624585914,
                            },
                        },
                    },
                },
            ],
            creator: {
                email: 'hamzashaikh@credenceanalytics.com',
                first_name: 'Hamza',
                last_login: '2022-10-25T15:31:34.327',
                is_qbnewb: false,
                is_superuser: true,
                id: 1,
                last_name: 'Shaikh',
                date_joined: '2022-10-13T11:17:22.699',
                common_name: 'Hamza Shaikh',
            },
            can_write: true,
            database_id: 1,
            enable_embedding: false,
            collection_id: 1,
            query_type: 'native',
            name: 'testing-question',
            last_query_start: '2022-10-25T15:13:27.648847+05:30',
            dashboard_count: 0,
            average_query_time: 734,
            creator_id: 1,
            moderation_reviews: [],
            updated_at: '2022-10-25T15:13:23.679',
            made_public_by_id: null,
            embedding_params: null,
            cache_ttl: null,
            dataset_query: {
                database: 1,
                native: {
                    query: 'select id,total from Orders;\n',
                    'template-tags': {},
                },
                type: 'native',
            },
            id: 8,
            display: 'table',
            'last-edit-info': {
                id: 1,
                email: 'hamzashaikh@credenceanalytics.com',
                first_name: 'Hamza',
                last_name: 'Shaikh',
                timestamp: '2022-10-25T15:09:08.062',
            },
            visualization_settings: {
                'table.pivot_column': 'QUANTITY',
                'table.cell_column': 'ID',
            },
            collection: {
                authority_level: null,
                description: null,
                archived: false,
                slug: 'hamza_shaikh_s_personal_collection',
                color: '#31698A',
                name: "Hamza Shaikh's Personal Collection",
                personal_owner_id: 1,
                id: 1,
                location: '/',
                namespace: null,
            },
            created_at: '2022-10-25T15:09:08.056',
            public_uuid: null,
        },
    ];

    const allMetabaseDashboardList = [
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
                email: 'hamzashaikh@credenceanalytics.com',
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
