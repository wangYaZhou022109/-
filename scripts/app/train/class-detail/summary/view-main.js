var types = require('./app/exam/research-question-types'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    SUMMARY_DETAIL_MODE = 1,
    ANSWER_DETAIL_MODE = 2,
    MUTIPLE_TYPE = 1,
    EVALUTE_QUESTIONARY_TYPE = 3,
    PERMIT_VIEW_COUNT = 1;

exports.bindings = {
    researchRecord: true,
    dimensions: true,
    state: true,
    questions: false
};

exports.type = 'dynamic';

exports.getEntity = function(id) {
    var question = this.bindings.questions.getQuestionById(id);
    return D.assign({}, question, {
        questionAttrs: _.orderBy(question.questionAttrs, ['name'], ['asc']),
        score: question.score / 100
    });
};

exports.getEntityModuleName = function(id, question) {
    var researchQuestionary = this.bindings.researchRecord.data.researchQuestionary;
    if (researchQuestionary && researchQuestionary.type !== EVALUTE_QUESTIONARY_TYPE
        && researchQuestionary.permitViewCount === PERMIT_VIEW_COUNT) {
        return types.get(question.type, SUMMARY_DETAIL_MODE);
    }
    return types.get(question.type, ANSWER_DETAIL_MODE);
};

exports.dataForEntityModule = function(question) {
    return {
        type: question.type,
        question: question
    };
};

exports.dataForTemplate = {
    isMutiple: function(data) {
        if (data.researchRecord.researchQuestionary) {
            return data.researchRecord.researchQuestionary.answerPaperRule === MUTIPLE_TYPE;
        }
        return true;
    }
};
