var _ = require('lodash/collection');

exports.bindings = {
    questionnaireList: true,
    state: false
};

exports.events = {
    'click addSurvey': 'addSurvey',
    'click addEva': 'addEva'
};

exports.handlers = {
    addSurvey: function() {
        var model = this.module.items['train/programme/select-research-activity'],
            me = this;
        me.app.viewport.modal(model, {
            callback: function(data) {
                var param = {
                    type: 2,
                    resourceId: data.id,
                    resourceName: data.name,
                    startTime: data.startTime,
                    endTime: data.endTime
                };
                me.module.dispatch('saveResearch', param);
            }
        });
    },
    addEva: function() {
        var model = this.module.items['train/programme/select-evaluate-questionary'],
            me = this;
        me.app.viewport.modal(model, {
            callback: function(data) {
                var param = {
                    type: 3,
                    resourceId: data.id,
                    resourceName: data.name,
                    startTime: data.startTime,
                    endTime: data.endTime
                };
                me.module.dispatch('saveResearch', param);
            }
        });
    }
};

exports.dataForTemplate = {
    questionnaireList: function(data) {
        _.map(data.questionnaireList || [], function(qnr, i) {
            var r = qnr;
            r.i = i + 1;
        });
        return data.questionnaireList;
    }
};

exports.actions = {
    'click del-qnr-*': 'delQuestionnair'
};

exports.dataForActions = {
    delQuestionnair: function(payload) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定删除此数据吗?';
            me.app.message.confirm(message, function() {
                me.module.dispatch('delQuestionnair', payload);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    showOnlineTheme: function() {
        this.app.viewport.modal(this.module.items.configOnline);
    }
};

// exports.mixin = {
//     findById: function(id) {
//         var questionnaireList = this.bindings.questionnaireList;
//         return _.find(questionnaireList, {
//             id: id
//         });
//     }
// };
