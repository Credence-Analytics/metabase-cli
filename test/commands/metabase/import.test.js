/* eslint-disable prettier/prettier */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable unicorn/no-zero-fractions */
/* eslint-disable prefer-const */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable import/newline-after-import */
/* eslint-disable one-var */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable array-callback-return */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable dot-notation */
/* eslint-disable no-undef */

const fs = require('fs-extra');
const { expect } = require('chai');
const path = require('path');
const { checkExistance, createOrUpdateQuestion, createOrUpdateDashboard } = require(path.join(__dirname, '../../../src/helper/metabase/import'));

describe('metabase import', () => {
    let queImpdata,
        resultQueList = [],
        resultDashList = [],
        queExistance = false,
        dashExistance = false,
        dashImpdata,
        queImpFilePath = path.resolve('question_portfolio_2022-09-16_11_56_33.json'),
        dashImpFilePath = path.resolve('dashboard_credence_dashboard_2022-09-16_12_07_04.json');

    const allMetabaseQuestionList = [
        {
            description: null,
            archived: false,
            collection_position: null,
            table_id: null,
            result_metadata: [
                {
                    name: 'PORTCODE',
                    display_name: 'PORTCODE',
                    base_type: 'type/Decimal',
                    effective_type: 'type/Decimal',
                    field_ref: [
                        'field',
                        'PORTCODE',
                        {
                            'base-type': 'type/Decimal',
                        },
                    ],
                    semantic_type: null,
                    fingerprint: {
                        global: {
                            'distinct-count': 1,
                            'nil%': 0.0,
                        },
                        type: {
                            'type/Number': {
                                min: 500151.0,
                                q1: 500151.0,
                                q3: 500151.0,
                                max: 500151.0,
                                sd: null,
                                avg: 500151.0,
                            },
                        },
                    },
                },
                {
                    name: 'PORTNAME',
                    display_name: 'PORTNAME',
                    base_type: 'type/Text',
                    effective_type: 'type/Text',
                    field_ref: [
                        'field',
                        'PORTNAME',
                        {
                            'base-type': 'type/Text',
                        },
                    ],
                    semantic_type: null,
                    fingerprint: {
                        global: {
                            'distinct-count': 1,
                            'nil%': 0.0,
                        },
                        type: {
                            'type/Text': {
                                'percent-json': 0.0,
                                'percent-url': 0.0,
                                'percent-email': 0.0,
                                'percent-state': 0.0,
                                'average-length': 13.0,
                            },
                        },
                    },
                },
                {
                    name: 'METHOD',
                    display_name: 'METHOD',
                    base_type: 'type/Text',
                    effective_type: 'type/Text',
                    field_ref: [
                        'field',
                        'METHOD',
                        {
                            'base-type': 'type/Text',
                        },
                    ],
                    semantic_type: null,
                    fingerprint: {
                        global: {
                            'distinct-count': 1,
                            'nil%': 0.0,
                        },
                        type: {
                            'type/Text': {
                                'percent-json': 0.0,
                                'percent-url': 0.0,
                                'percent-email': 0.0,
                                'percent-state': 0.0,
                                'average-length': 3.0,
                            },
                        },
                    },
                },
                {
                    name: 'CUSTCODE',
                    display_name: 'CUSTCODE',
                    base_type: 'type/Text',
                    effective_type: 'type/Text',
                    field_ref: [
                        'field',
                        'CUSTCODE',
                        {
                            'base-type': 'type/Text',
                        },
                    ],
                    semantic_type: null,
                    fingerprint: {
                        global: {
                            'distinct-count': 1,
                            'nil%': 1.0,
                        },
                        type: {
                            'type/Text': {
                                'percent-json': 0.0,
                                'percent-url': 0.0,
                                'percent-email': 0.0,
                                'percent-state': 0.0,
                                'average-length': 0.0,
                            },
                        },
                    },
                },
            ],
            creator: {
                email: 'jayavaiya@credenceanalytics.com',
                first_name: 'Jay ',
                last_login: '2022-09-22T17:25:23',
                is_qbnewb: false,
                is_superuser: true,
                id: 1,
                last_name: 'Avaiya',
                date_joined: '2022-09-15T18:06:16',
                common_name: 'Jay  Avaiya',
            },
            database_id: 5,
            enable_embedding: false,
            collection_id: 1,
            query_type: 'native',
            name: 'Porfolio',
            creator_id: 1,
            updated_at: '2022-09-22T17:25:33',
            made_public_by_id: 1,
            embedding_params: null,
            cache_ttl: null,
            dataset_query: {
                type: 'native',
                native: {
                    query: 'SELECT portcode,portname,method,custcode FROM tbl_portmast',
                    'template-tags': {},
                },
                database: 5,
            },
            id: 7,
            display: 'table',
            'last-edit-info': {
                id: 1,
                email: 'jayavaiya@credenceanalytics.com',
                first_name: 'Jay ',
                last_name: 'Avaiya',
                timestamp: '2022-09-22T17:25:32',
            },
            visualization_settings: {
                'table.pivot_column': 'PORTNAME',
                'table.cell_column': 'PORTCODE',
            },
            collection: {
                authority_level: null,
                description: null,
                archived: false,
                slug: 'jay__avaiya_s_personal_collection',
                color: '#31698A',
                name: "Jay  Avaiya's Personal Collection",
                personal_owner_id: 1,
                id: 1,
                location: '/',
                namespace: null,
            },
            favorite: false,
            created_at: '2022-09-22T17:25:33',
            public_uuid: '8d8e317d-f0fc-4a34-984f-3012a744b915',
        },
        {
            description: null,
            archived: false,
            collection_position: null,
            table_id: null,
            result_metadata: [
                {
                    name: 'PORTTYPE',
                    display_name: 'PORTTYPE',
                    base_type: 'type/Text',
                    effective_type: 'type/Text',
                    field_ref: [
                        'field',
                        'PORTTYPE',
                        {
                            'base-type': 'type/Text',
                        },
                    ],
                    semantic_type: null,
                    fingerprint: {
                        global: {
                            'distinct-count': 1,
                            'nil%': 0.0,
                        },
                        type: {
                            'type/Text': {
                                'percent-json': 0.0,
                                'percent-url': 0.0,
                                'percent-email': 0.0,
                                'percent-state': 0.0,
                                'average-length': 1.0,
                            },
                        },
                    },
                },
                {
                    name: 'PORTCODE',
                    display_name: 'PORTCODE',
                    base_type: 'type/Decimal',
                    effective_type: 'type/Decimal',
                    field_ref: [
                        'field',
                        'PORTCODE',
                        {
                            'base-type': 'type/Decimal',
                        },
                    ],
                    semantic_type: null,
                    fingerprint: {
                        global: {
                            'distinct-count': 1,
                            'nil%': 0.0,
                        },
                        type: {
                            'type/Number': {
                                min: 500151.0,
                                q1: 500151.0,
                                q3: 500151.0,
                                max: 500151.0,
                                sd: null,
                                avg: 500151.0,
                            },
                        },
                    },
                },
                {
                    name: 'AUTHORIZEDBY',
                    display_name: 'AUTHORIZEDBY',
                    base_type: 'type/Text',
                    effective_type: 'type/Text',
                    field_ref: [
                        'field',
                        'AUTHORIZEDBY',
                        {
                            'base-type': 'type/Text',
                        },
                    ],
                    semantic_type: 'type/Author',
                    fingerprint: {
                        global: {
                            'distinct-count': 1,
                            'nil%': 1.0,
                        },
                        type: {
                            'type/Text': {
                                'percent-json': 0.0,
                                'percent-url': 0.0,
                                'percent-email': 0.0,
                                'percent-state': 0.0,
                                'average-length': 0.0,
                            },
                        },
                    },
                },
            ],
            creator: {
                email: 'jayavaiya@credenceanalytics.com',
                first_name: 'Jay ',
                last_login: '2022-09-22T17:25:23',
                is_qbnewb: false,
                is_superuser: true,
                id: 1,
                last_name: 'Avaiya',
                date_joined: '2022-09-15T18:06:16',
                common_name: 'Jay  Avaiya',
            },
            database_id: 5,
            enable_embedding: false,
            collection_id: 1,
            query_type: 'native',
            name: 'portfolio_asset_costing',
            creator_id: 1,
            updated_at: '2022-09-22T17:25:33',
            made_public_by_id: 1,
            embedding_params: null,
            cache_ttl: null,
            dataset_query: {
                type: 'native',
                native: {
                    query: 'select porttype, portcode, authorizedby from TBL_PORTMAST',
                    'template-tags': {},
                },
                database: 5,
            },
            id: 5,
            display: 'table',
            'last-edit-info': {
                id: 1,
                email: 'jayavaiya@credenceanalytics.com',
                first_name: 'Jay ',
                last_name: 'Avaiya',
                timestamp: '2022-09-22T17:25:32',
            },
            visualization_settings: {
                'table.pivot_column': 'PORTTYPE',
                'table.cell_column': 'PORTCODE',
            },
            collection: {
                authority_level: null,
                description: null,
                archived: false,
                slug: 'jay__avaiya_s_personal_collection',
                color: '#31698A',
                name: "Jay  Avaiya's Personal Collection",
                personal_owner_id: 1,
                id: 1,
                location: '/',
                namespace: null,
            },
            favorite: false,
            created_at: '2022-09-22T11:45:30',
            public_uuid: 'f676ec98-da0c-4784-9d56-0d608d989452',
        },
    ];

    const allMetabaseDashboardList = [
        {
            description: 'This dashboard manages all the assets.',
            archived: false,
            collection_position: null,
            creator: {
                email: 'jayavaiya@credenceanalytics.com',
                first_name: 'Jay ',
                last_login: '2022-09-22T17:25:23',
                is_qbnewb: false,
                is_superuser: true,
                id: 1,
                last_name: 'Avaiya',
                date_joined: '2022-09-15T18:06:16',
                common_name: 'Jay  Avaiya',
            },
            enable_embedding: false,
            collection_id: 1,
            show_in_getting_started: false,
            name: 'Assets Dashboard',
            caveats: null,
            creator_id: 1,
            updated_at: '2022-09-22T16:41:12',
            made_public_by_id: null,
            embedding_params: null,
            cache_ttl: null,
            id: 3,
            position: null,
            'last-edit-info': {
                id: 1,
                email: 'jayavaiya@credenceanalytics.com',
                first_name: 'Jay ',
                last_name: 'Avaiya',
                timestamp: '2022-09-22T16:41:11',
            },
            parameters: [],
            favorite: false,
            created_at: '2022-09-19T17:21:00',
            public_uuid: null,
            points_of_interest: null,
        },
        {
            description: null,
            archived: false,
            collection_position: null,
            creator: {
                email: 'jayavaiya@credenceanalytics.com',
                first_name: 'Jay ',
                last_login: '2022-09-22T17:25:23',
                is_qbnewb: false,
                is_superuser: true,
                id: 1,
                last_name: 'Avaiya',
                date_joined: '2022-09-15T18:06:16',
                common_name: 'Jay  Avaiya',
            },
            enable_embedding: false,
            collection_id: 1,
            show_in_getting_started: false,
            name: 'Portfolio Dashboard',
            caveats: null,
            creator_id: 1,
            updated_at: '2022-09-22T17:25:33',
            made_public_by_id: 1,
            embedding_params: null,
            cache_ttl: null,
            id: 7,
            position: null,
            'last-edit-info': {
                id: 1,
                email: 'jayavaiya@credenceanalytics.com',
                first_name: 'Jay ',
                last_name: 'Avaiya',
                timestamp: '2022-09-22T17:25:33',
            },
            parameters: [],
            favorite: false,
            created_at: '2022-09-22T17:25:32',
            public_uuid: 'e89d1dbf-8cb7-4b1b-9dfd-52546c52c70d',
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
            const result = createOrUpdateDashboard(dashExistance, allMetabaseDashboardList, dashImpdata, allMetabaseQuestionList);
            resultDashList = result['allMetabaseDashboardList'];
            resultQueList = result['allMetabaseQuestionList'];
            if (!!!dashExistance) expect(resultDashList.length).to.be.gt(allMetabaseDashboardList.length);
            expect(resultDashList.find((x) => x.name === dashImpdata.data.name)['parameters'].length).to.be.eq(dashImpdata.data['parameters'].length);
        });

        it('Tagging and publish status check of imported questions', () => {
            const questionInImpDash = dashImpdata.data['ordered_cards'].map((x) => x),
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
