var _ = require('lodash/collection'),
    types = require('./app/train/programme/exam/exam-question-types'),
    D = require('drizzlejs');

exports.type = 'dynamic';

exports.bindings = {
    sub: true
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
    if (!question.questionAttrs) {
        D.assign(question, {
            questionAttrs: question.questionAttrCopys
        });
    }
    return question;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, 2);
};

exports.dataForEntityModule = function(question) {
    return {
        type: question.type,
        data: question,
        multiple: question.type === 2
    };
};
