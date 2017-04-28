var _ = require('lodash/collection'),
    types = require('./app/train/programme/exam/exam-question-types');

exports.type = 'dynamic';

exports.bindings = {
    sub: true
};

exports.events = {
    'click edit-*': 'editSub',
    'click delete-*': 'deleteSub'
};

exports.handlers = {
    editSub: function(id) {
        var data = this.bindings.sub.getQuestionById(id),
            opt = {
                data: data,
                multiple: Number(data.type) === 2,
                title: Number(data.type) === 1 ? '单选' : '多选',
                editMode: 2
            };
        this.app.viewport.modal(this.module.items.modal, opt);
    },
    deleteSub: function(id) {
        var message = '确定要删除该数据?',
            me = this,
            questions = this.bindings.sub.data.questions;

        me.app.message.confirm(message, function() {
            var qq = _.filter(questions, function(q) {
                return q.id !== id;
            });
            me.bindings.sub.data.questions = qq;
            me.module.dispatch('refreshSub');
        }, function() {
            return false;
        });
    }
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
    return this.module.store.models.sub.getQuestionById(id);
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
