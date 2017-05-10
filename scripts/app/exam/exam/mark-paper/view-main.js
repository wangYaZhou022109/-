var options = require('./app/exam/exam/base-paper/view-main'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    bindings = D.assign({}, obj.bindings),
    types = require('./app/exam/exam-question-types'),
    constant = {
        MARK_PAPER_MODE: 4,
        NO_DETAIL_MODE: -1 // 除了题目内容，其他答案以及信息看不到
    },
    getModuleDataForQuestion;

obj.bindings = bindings;
D.assign(obj.bindings, {
    grades: true
});

D.assign(obj, {
    type: 'dynamic',
    getEntity: function(id) {
        var question;
        question = this.bindings.types.getQuestionById(id);
        question = D.assign({}, question, { questionAttrs: question.questionAttrCopys });

        return { isCorrect: true, data: question };
    },
    getEntityModuleName: function(id, entity) {
        return types.get(entity.data.type, constant.MARK_PAPER_MODE);
    },
    dataForEntityModule: function(entity) {
        return getModuleDataForQuestion.call(this, entity.data);
    }
});

getModuleDataForQuestion = function(question) {
    var me = this;
    return {
        data: question,
        goal: this.bindings.grades.getGrade(question.id),
        callback: function(data) {
            return me.module.dispatch('saveGrade', data);
        }
    };
};

module.exports = obj;

