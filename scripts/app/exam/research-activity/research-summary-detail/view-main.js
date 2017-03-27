var types = require('./app/exam/research-question-types'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    SUMMARY_DETAIL_MODE = 1,
    MUTIPLE_TYPE = 1;

exports.bindings = {
    researchRecord: true,
    questions: true,
    dimensions: true,
    state: true
};

exports.type = 'dynamic';

exports.getEntity = function(id) {
    var question = this.bindings.questions.getQuestionById(id);
    return D.assign({}, question, {
        questionAttrs: _.orderBy(question.questionAttrs, ['createTime'], ['asc']),
        score: question.score / 100
    });
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, SUMMARY_DETAIL_MODE);
};

exports.dataForEntityModule = function(question) {
    return {
        type: question.type,
        question: question
    };
};

exports.dataForTemplate = {
    isMutiple: function(data) {
        return data.researchRecord.researchQuestionary.answerPaperRule === MUTIPLE_TYPE;
    }
};
