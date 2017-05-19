var options = require('./app/exam/exam/base-paper/view-main'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    bindings = D.assign({}, obj.bindings),
    types = require('./app/exam/exam-question-types');

obj.bindings = bindings;
D.assign(obj.bindings, {
    grades: false
});

D.assign(obj, {
    type: 'dynamic',
    getEntity: function(id) {
        var question = this.bindings.types.getQuestionById(id),
            entity = D.assign({}, question);
        entity = D.assign(entity, {
            questionAttrs: question.questionAttrCopys,
        });
        return entity;
    },
    getEntityModuleName: function(id, question) {
        return types.get(question.type, 4);
    },
    dataForEntityModule: function(question) {
        var me = this;
        return {
            data: question,
            goal: this.bindings.grades.getGrade(question.id),
            callback: function(data) {
                return me.module.dispatch('saveGrade', data);
            }
        };
    }
});

module.exports = obj;
