var maps = require('./app/util/maps'),
    _ = require('lodash/collection');


exports.bindings = {
    state: true
};

exports.events = {
    'change mark-type-*': 'changeMarkType',
    'click choose-p-*': 'selectTeacher',
    'click choose-qt-*': 'selectTeacher',
    'click choose-q-*': 'selectTeacher',
    'click anonymity-mark': 'changeAnonymityMark'
};

exports.handlers = {
    changeMarkType: function(type) {
        var data = this.bindings.state.data,
            markType = Number(type),
            me = this;
        return this.Promise.create(function(resolve) {
            var message = '请确定更改评卷方式吗';
            me.app.message.confirm(message, function() {
                data.isPaper = markType === 1;
                data.isQuestionType = markType === 2;
                data.isQuestion = markType === 3;
                data.markType = markType;
                me.bindings.state.reset();
                return me.module.dispatch('reload');
            }, function() {
                resolve(false);
            });
        });
    },
    selectTeacher: function(data) {
        var view = this.module.items['picker/select-member'],
            state = this.bindings.state.data,
            me = this,
            getIds = function() {
                var ids = '';
                if (state.isPaper) ids = _.map(state.markPapers[data].markMembers, 'id').join(',');
                if (state.isQuestionType) ids = _.map(state.markQuestionTypes[data].markMembers, 'id').join(',');
                if (state.isQuestion) ids = _.map(state.markQuestions[data].markMembers, 'id').join(',');
                return ids;
            },
            callback = function(member, flag) {
                var paperMembers,
                    questionTypeMembers,
                    questionMembers;

                if (state.isPaper) {
                    paperMembers = state.markPapers[data].markMembers;
                    if (flag) {
                        paperMembers.push({ id: member.id, name: member.name });
                    } else {
                        state.markPapers[data].markMembers = _.reject(paperMembers, ['id', member.id]);
                    }
                }
                if (state.isQuestionType) {
                    questionTypeMembers = state.markQuestionTypes[data].markMembers;
                    if (flag) {
                        questionTypeMembers.push({ id: member.id, name: member.name });
                    } else {
                        state.markQuestionTypes[data].markMembers = _.reject(questionTypeMembers, ['id', member.id]);
                    }
                }
                if (state.isQuestion) {
                    questionMembers = state.markQuestions[data].markMembers;
                    if (flag) {
                        questionMembers.push({ id: member.id, name: member.name });
                    } else {
                        state.markQuestions[data].markMembers = _.reject(questionMembers, ['id', member.id]);
                    }
                }
                return me.module.dispatch('reload');
            };
        this.app.viewport.modal(view, {
            ids: getIds(),
            callback: callback
        });
    },
    changeAnonymityMark: function(e, t) {
        var data = this.bindings.state.data;
        if (t.checked) {
            data.anonymityMark = 1;
        } else {
            data.anonymityMark = 0;
        }
    }
};

exports.dataForTemplate = {
    markTypes: function() {
        var me = this,
            markTypes = _.map(maps.get('mark-type'), function(t) {
                var type = t;
                type.selected = Number(type.key) === me.bindings.state.data.markType;
                return type;
            });
        return markTypes;
    },
    anonymityMark: function() {
        return Number(this.bindings.state.data.anonymityMark) === 1;
    }
};

exports.components = [{
    id: 'sort',
    name: 'selectize'
}, {
    id: 'mark-type',
    name: 'selectize'
}];
