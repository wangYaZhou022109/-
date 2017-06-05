var _ = require('lodash/collection'),
    types = require('./app/exam/exam-question-types'),
    D = require('drizzlejs'),
    READING_SUB_INDEX_TYPE = 1;

exports.type = 'dynamic';

exports.bindings = {
    sub: true,
    answer: true,
    state: true
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
    var question = this.module.store.models.sub.getQuestionById(id),
        target = D.assign({}, question),
        answerRecord = D.assign({}, question.answerRecord);
    if (!question.questionAttrs) {
        D.assign(target, {
            questionAttrs: _.orderBy(question.questionAttrCopys, ['name'], ['asc']),
            answerRecord: D.assign(answerRecord, { score: answerRecord.score / 100 })
        });
    }
    return target;
};

exports.getEntityModuleName = function(id, question) {
    return types.get(question.type, 3);
};

exports.dataForEntityModule = function(question) {
    var me = this;
    return {
        type: question.type,
        data: question,
        multiple: question.type === 2,
        callback: function(data) {
            me.bindings.answer.save(data);
            return me.module.dispatch('save');
        },
        answer: this.bindings.answer.getAnswer(question.id),
        mode: (question.type === 1 || question.type === 2)
            ? 1 : this.bindings.state.data.detailMode,
        indexType: READING_SUB_INDEX_TYPE //  区分阅读题子题目时，索引展示类型
    };
};
