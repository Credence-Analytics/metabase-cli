const path = require('path')
const { initLogger, CredError } = require(path.join(__dirname, '../logger.js'));
const logger = initLogger('metabase');


function checkExistance(existingQueOrDashList, impdata) {
    try {
        if (!impdata.data) throw new Error('Data property does not exist in the provided json file.');
        const data = impdata.data;
        if (!data.name) throw new Error("Provide json file with valid data.")
        return existingQueOrDashList.find(x => x.name == data.name);
    } catch (error) {
        throw error;
    }
}

function createOrUpdateQuestion(queExistance, allMetabaseQuestions, queImpdata, tagging = false, dashboardID = null) {
    try {
        const {
            data: { name: selectedQueName, public_uuid },
        } = queImpdata;

        // impdata.data
        if (queExistance) {
            // update the question
            logger.info(`Question ${selectedQueName} already exist. Updating ...`);
            allMetabaseQuestions = allMetabaseQuestions.map((mbQuestion) => {
                if (mbQuestion.name === selectedQueName) return { ...mbQuestion, ...queImpdata.data }
                return mbQuestion
            })
            // update allMetabaseQuestionList variable here
            logger.info(`Question : ${selectedQueName} updated successfully`);
        } else {
            // creating the question
            logger.info(`Creating Question : ${selectedQueName}`);
            // append this new question to allMetabaseQuestionList
            allMetabaseQuestions = [...allMetabaseQuestions, queImpdata.data]
            logger.info(`Question ${selectedQueName} created successfully`);
        }
        if (tagging) {
            // tagging the question to the dashboard
            logger.info(`Tagging question ${selectedQueName} to the dashbard with id : ${dashboardID}`);
            allMetabaseQuestions = tagQuestion(allMetabaseQuestions, selectedQueName, dashboardID);
            logger.info(`Question ${selectedQueName} tagged successfully`);
        }
        // publishing the question
        if (!public_uuid) {
            logger.info(`Publishing Question ${selectedQueName}`);
            let publish_id = "9000"
            allMetabaseQuestions = publish(allMetabaseQuestions, selectedQueName, publish_id);
            logger.info(`Question ${selectedQueName} published successfully`);
        }
        return allMetabaseQuestions
    } catch (error) {
        throw new CredError('Failed to import question');
    }
}

// new
function createOrUpdateDashboard(dashExistance, allMetabaseDashboardList, dashImpdata, allMetabaseQuestionList) {
    try {
        let payload = {},
            createParams,
            dashboardID;

        const {
            data: { name: selectedDashName, ordered_cards: questionsInImpdata },
        } = dashImpdata;

        // Deleting existing dashboard
        if (dashExistance) {
            logger.info(`Deleting dashboard : ${selectedDashName}`)
            allMetabaseDashboardList = allMetabaseDashboardList.filter(dashboard => dashboard.name !== selectedDashName)
        }

        // creating new dashboard from dashImpdata
        logger.info(`Creating the dashboard : ${selectedDashName}`)
        createParams = ['can_write', 'enable_embedding', 'collection_id', 'show_in_getting_started', 'name', 'parameters', 'public_uuid', 'points_of_interest', 'id'];

        Object.keys(dashImpdata.data).map(key => {
            if (createParams.includes(key)) {
                payload[key] = dashImpdata.data[key];
            }
        });
        if (!payload["parameters"]) payload["parameters"] = []
        dashboardID = payload.id;
        allMetabaseDashboardList = [...allMetabaseDashboardList, payload]
        logger.info(`Dashboard : ${selectedDashName} created successfully`)

        // importing all the questions
        try {
            logger.info(`Importing all the questions to the dashboard : ${selectedDashName}`)
            questionsInImpdata.map(questionData => {
                let existance;
                existance = checkExistance(allMetabaseQuestionList, { data: questionData.card })
                allMetabaseQuestionList = createOrUpdateQuestion(existance, allMetabaseQuestionList, { data: questionData.card }, true, dashboardID)
            })
        } catch (error) {
            throw new Error(`Failed to import questions to the dashboard`);
        }

        // publishing newly created dashboard
        logger.info(`Publishing dashboard : ${selectedDashName}`);
        let publish_id = "9000"
        allMetabaseDashboardList = publish(allMetabaseDashboardList, selectedDashName, publish_id);
        logger.info('Dashboard published successfully');
        return { allMetabaseDashboardList, allMetabaseQuestionList }
    } catch (error) {
        logger.info(error);
        throw new CredError('Dashboard import failed.');
    }
}


function tagQuestion(allMetabaseQuestionList, questionName, dashboardID) {
    try {
        return allMetabaseQuestionList.map((metabaseQues) => {
            if (metabaseQues.name === questionName) return { ...metabaseQues, dashboard_id: dashboardID }
            return metabaseQues
        })
    } catch (error) {
        throw new Error(`Failed to tag question`);
    }
}

function publish(itemList, selectedItemName, publish_id) {
    try {
        let udpatedList;
        udpatedList = itemList.map((metabaseQues) => {
            if (metabaseQues.name === selectedItemName) return { ...metabaseQues, public_uuid: publish_id }
            return metabaseQues
        })
        return udpatedList
    } catch (error) {
        throw new Error(`Failed to tag question`);
    }
}

module.exports = { checkExistance, createOrUpdateQuestion, createOrUpdateDashboard }