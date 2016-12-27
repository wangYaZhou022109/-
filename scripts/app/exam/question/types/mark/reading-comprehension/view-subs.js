var _ = require('lodash/collection'),
    types = require('./app/exam/types'),
    D = require('drizzlejs');

exports.type = 'dynamic';

exports.bindings = {
    sub: true,
    goal: true
};

exports.dataForTemplate = {
    subs: function() {
        var subs = this.bindings.sub.data.questions;
        return _.map(subs, function(s, i) {
            var sub = s;
            sub.index = i + 1;
            return sub;
        });
    }
};

exports.getEntity = function(id) {
    var question = this.module.store.models.sub.getQuestionById(id);
    D.assign(question, {
        questionAttrs: question.questionAttrCopys
    });
    return question;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, 4);
};

exports.dataForEntityModule = function(question) {
    var me = this;
    return {
        type: question.type,
        data: question,
        multiple: question.type === 2,
        callback: function(data) {
            me.bindings.goal.save(data);
            return me.module.dispatch('save');
        },
        goal: this.bindings.goal.getGoal(question.id)
    };
};
