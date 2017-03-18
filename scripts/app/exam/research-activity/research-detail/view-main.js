var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    types = require('./app/exam/exam-question-types'),
    ANSWER_MODE = 3,
    MUTIPLE_CHOOSE = 2;

exports.type = 'dynamic';

exports.bindings = {
    researchRecord: true,
    questions: false,
    answer: false,
    dimensions: true
};

exports.getEntity = function(id) {
    var question = this.module.store.models.questions.getQuestionById(id);
    question = D.assign({}, question, {
        questionAttrs: _.orderBy(question.questionAttrs, ['createTime'], ['asc'])
    });
    return question;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, ANSWER_MODE);
};

exports.dataForEntityModule = function(question) {
    var me = this;
    return {
        type: question.type,
        data: question,
        multiple: question.type === MUTIPLE_CHOOSE,
        answer: this.bindings.answer.getAnswer(question.id),
        callback: function(data) {
            me.bindings.answer.saveAnswer(data);
        }
    };
};

