var types = require('./app/exam/types'),
    D = require('drizzlejs'),
    constant = {
        MARK_PAPER_MODE: 4,
        NO_DETAIL_MODE: -1 // 除了题目内容，其他答案以及信息看不到
    },
    getModuleDataForQuestion;

exports.bindings = {
    state: true,
    types: false
};

exports.type = 'dynamic';

exports.getEntity = function(id) {
    var question;
    question = this.bindings.types.getQuestionById(id);
    D.assign(question, { questionAttrs: question.questionAttrCopys });

    return { isCorrect: true, data: question };
};

exports.getEntityModuleName = function(id, entity) {
    return types.get(entity.data.type, constant.MARK_PAPER_MODE);
};

exports.dataForEntityModule = function(entity) {
    return getModuleDataForQuestion.call(this, entity.data);
};

getModuleDataForQuestion = function(question) {
    var me = this;
    return {
        data: question,
        answer: null,
        mode: constant.NO_DETAIL_MODE,
        callback: function(data) {
            return me.module.dispatch('saveAnswer', data);
        }
    };
};
