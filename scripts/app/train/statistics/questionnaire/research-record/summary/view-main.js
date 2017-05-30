var types = require('./app/exam/research-question-types'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    DETAIL_SUMMARY_MODE = 2;

exports.bindings = {
    summaryDetail: true,
    questions: true,
    dimensions: true
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
    return types.get(question.type, DETAIL_SUMMARY_MODE);
};

exports.dataForEntityModule = function(question) {
    var questionData = question;
    questionData.researchQuestionary = this.bindings.summaryDetail.data;
    return {
        type: question.type,
        question: questionData
    };
};
