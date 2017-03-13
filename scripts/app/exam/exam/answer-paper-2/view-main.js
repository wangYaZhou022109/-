var types = require('./app/exam/types'),
    D = require('drizzlejs'),
    constant = {
        ANSWER_PAPER_MODE: 3,
        NO_DETAIL_MODE: -1, // 除了题目内容，其他答案以及信息看不到
        WAITING_CHECK_CORRECT: 'exam/exam/answer-paper-2/waiting-check-correct'
    },
    getModuleDataForQuestion,
    getModuleDataForCorrect;

exports.bindings = {
    state: true,
    types: false,
    mark: false,
    answer: false
};

exports.type = 'dynamic';

exports.getEntity = function(id) {
    var question,
        questionId;
    questionId = id;
    if (this.bindings.mark.isCorrectView(id)) {
        questionId = id.replace('correct-', '');
    }

    question = this.bindings.types.getQuestionById(questionId);
    D.assign(question, { questionAttrs: question.questionAttrCopys });

    return this.bindings.mark.isCorrectView(id)
        ? { isCorrect: true, data: question } : { isCorrect: false, data: question };
};

exports.getEntityModuleName = function(id, entity) {
    return entity.isCorrect
        ? constant.WAITING_CHECK_CORRECT
        : types.get(entity.data.type, constant.ANSWER_PAPER_MODE);
};

exports.dataForEntityModule = function(entity) {
    return entity.isCorrect
        ? getModuleDataForCorrect.call(this, entity.data)
        : getModuleDataForQuestion.call(this, entity.data);
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

getModuleDataForCorrect = function(question) {
    var me = this;
    return {
        questionId: question.id,
        correct: this.bindings.mark.getCorrect(question.id) || {},
        callback: {
            waitingCheck: function(data) {
                return me.module.dispatch('waitingCheck', data);
            },
            correct: function(data) {
                return me.module.dispatch('correct', data);
            }
        }
    };
};

