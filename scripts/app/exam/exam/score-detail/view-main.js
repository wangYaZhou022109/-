var types = require('./app/exam/exam-question-types'),
    D = require('drizzlejs'),
    constant = {
        ANSWER_PAPER_MODE: 3,
        NO_DETAIL_MODE: -1 // 除了题目内容，其他答案以及信息看不到
    },
    getModuleDataForQuestion;

exports.bindings = {
    state: true,
    types: false,
    answer: false
};

exports.type = 'dynamic';

exports.getEntity = function(id) {
    var question;

    question = this.bindings.types.getQuestionById(id);
    D.assign(question, { questionAttrs: question.questionAttrCopys });

    return question;
};

exports.getEntityModuleName = function(id, entity) {
    return types.get(entity.type, constant.ANSWER_PAPER_MODE);
};

exports.dataForEntityModule = function(entity) {
    return getModuleDataForQuestion.call(this, entity);
};

getModuleDataForQuestion = function(question) {
    var me = this;
    return {
        data: question,
        answer: me.bindings.answer.getAnswer(question.id),
        mode: constant.NO_DETAIL_MODE,
        callback: function(data) {
            return me.module.dispatch('saveAnswer', data);
        }
    };
};

