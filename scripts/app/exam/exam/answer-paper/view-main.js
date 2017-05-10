var options = require('./app/exam/exam/base-paper/view-main'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    bindings = D.assign({}, obj.bindings),
    types = require('./app/exam/exam-question-types'),
    constant = {
        ANSWER_PAPER_MODE: 3,
        NO_DETAIL_MODE: -1, // 除了题目内容，其他答案以及信息看不到
        WAITING_CHECK_CORRECT: 'exam/exam/answer-paper/waiting-check-correct'
    },
    getModuleDataForQuestion,
    getModuleDataForCorrect;


obj.bindings = bindings;
D.assign(obj.bindings, {
    mark: false,
    answer: false
});

D.assign(obj, {
    type: 'dynamic',
    getEntity: function(id) {
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
    },
    getEntityModuleName: function(id, entity) {
        return entity.isCorrect
            ? constant.WAITING_CHECK_CORRECT
            : types.get(entity.data.type, constant.ANSWER_PAPER_MODE);
    },
    dataForEntityModule: function(entity) {
        return entity.isCorrect
            ? getModuleDataForCorrect.call(this, entity.data)
            : getModuleDataForQuestion.call(this, entity.data);
    }
});

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
        waitingCheck: this.bindings.mark.getWaitingCheck(question.id),
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


module.exports = obj;
