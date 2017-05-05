var _ = require('lodash/collection'),
    $ = require('jquery'),
    editHander,
    viewHander,
    attachmentId;
    // $ = require('jquery'),
    // markers = require('./app/ext/views/form/markers'),
    // validators = require('./app/ext/views/form/validators');

exports.bindings = {
    questionnaireList: true,
    state: false,
    research: true
};

exports.events = {
    'click addSurvey': 'addSurvey',
    'click addEva': 'addEva',
    'click addExam': 'addExam',
    'click minimize-*': 'showMinimize',
    'click view-qnr-*': 'viewQuestionar'
};

exports.handlers = {
    addSurvey: function() {
        var model = this.module.items['train/programme/select-research-activity'],
            me = this;
        me.app.viewport.modal(model, {
            sourceType: 2,
            callback: function(data) {
                var param = {
                    type: 2,
                    resourceId: data.id,
                    resourceName: data.name,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    isAdd: data.isAdd
                };
                me.module.dispatch('saveResearch', param);
            }
        });
    },
    addEva: function() {
        var model = this.module.items['train/programme/evaluate-questionary/select-evaluate-questionary'],
            me = this;
        me.app.viewport.modal(model, {
            sourceType: 2,
            callback: function(data) {
                var param = {
                    type: 3,
                    resourceId: data.id,
                    resourceName: data.name,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    isAdd: data.isAdd
                };
                me.module.dispatch('saveResearch', param);
            }
        });
    },
    addExam: function() {
        var model = this.module.items['train/programme/exam/other-module-exam'],
            me = this;
        me.app.viewport.modal(model, {
            sourceType: 2,
            callback: function(data) {
                var param = {
                    type: 1,
                    resourceId: data.id,
                    resourceName: data.name,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    isAdd: data.isAdd,
                    attachmentId: data.paperClassId,
                };
                attachmentId = data.paperClassId;
                me.module.dispatch('saveResearch', param);
            }
        });
    },
    showMinimize: function(id) {
        $(this.$('minitable-' + id)).toggle();
        if ($(this.$('min-' + id)).text() === '最小化') {
            $(this.$('min-' + id)).text('最大化');
            $(this.$('minimize-' + id)).addClass('icon-add-full').removeClass('icon-minus-full');
        } else {
            $(this.$('min-' + id)).text('最小化');
            $(this.$('minimize-' + id)).addClass('icon-minus-full').removeClass('icon-add-full');
        }
    },
    viewQuestionar: function(id) {
        var questionnaireList = this.bindings.questionnaireList,
            questionary,
            type;
        questionary = _.find(questionnaireList.data, { id: id });
        type = questionary.type;
        if (viewHander[type]) {
            viewHander[type].call(this, {
                id: questionary.resourceId,
                questionary: questionary,
            });
        }
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
    'click del-qnr-*': 'delQuestionnair',
    'click edit-qnr-*': 'toEdit'
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
        this.app.viewport.modal(this.module.items['config-online']);
    },
    toEdit: function() {
        var isAdd = this.bindings.research.data.isAdd,
            type = this.bindings.research.data.type,
            id = this.bindings.research.data.id,
            me = this,
            callback = function(data) {
                return me.module.dispatch('editQuestionnair', {
                    id: id,
                    data: data
                });
            },
            result;
        if (isAdd === 1) {
            result = editHander[type].call(this, {
                id: id,
                questionnaire: this.bindings.research.data
            }, callback);
        }

        if (isAdd === 0) {
            result = this.app.viewport.modal(this.module.items['edit-qnrtime']);
        }
        return result;
    }
};

editHander = {
    1: function(payload, callback) {
        var view = this.module.items['train/programme/exam/other-module-exam'],
            questionnaire = payload.questionnaire;
        return this.app.viewport.modal(view, {
            id: questionnaire.resourceId,
            sourceType: 2,
            startTime: questionnaire.startTime,
            endTime: questionnaire.endTime,
            callback: function(exam) {
                return callback({
                    id: payload.id,
                    resourceName: exam.name,
                    startTime: exam.startTime,
                    endTime: exam.endTime,
                    item: exam
                });
            }
        });
    },
    2: function(payload, callback) {
        var view = this.module.items['train/programme/research-activity/add-research-third-party'],
            questionnaire = payload.questionnaire;
        return this.app.viewport.modal(view, {
            researchId: questionnaire.resourceId,
            titleType: questionnaire.resourceId ? 'edit' : 'add',
            sourceType: 2,
            startTime: questionnaire.startTime,
            endTime: questionnaire.endTime,
            callback: function(research) {
                return callback({
                    id: payload.id,
                    resourceName: research.name,
                    startTime: research.startTime,
                    endTime: research.endTime,
                    item: research
                });
            }
        });
    },
    3: function(payload, callback) {
        var view = this.module.items['train/programme/evaluate-questionary' +
        '/select-evaluate-questionary/add-research-refrence'],
            questionnaire = payload.questionnaire;
        return this.app.viewport.modal(view, {
            researchId: questionnaire.resourceId,
            name: questionnaire.name,
            startTime: questionnaire.startTime,
            endTime: questionnaire.endTime,
            titleType: questionnaire.resourceId ? 'edit' : 'add',
            sourceType: 2,
            callback: function(questionary) {
                return callback({
                    id: payload.id,
                    resourceName: questionary.name,
                    startTime: questionary.startTime,
                    endTime: questionary.endTime,
                    item: questionary
                });
            }
        });
    }
};

viewHander = {
    1: function(payload) {
        var questionary = payload.questionary;
        var view = this.module.items['train/programme/exam/paper/preview-paper'];
        this.app.viewport.modal(view, { paperId: attachmentId, exam: { name: questionary.resourceName } });
    },
    2: function(payload) {
        var questionary = payload.questionary;
        var view = this.module.items['train/programme/research-activity/preview-questionary'];
        this.app.viewport.modal(view, { researchId: questionary.resourceId, name: questionary.resourceName });
    },
    3: function(payload) {
        var questionary = payload.questionary;
        var view = this.module.items['train/programme/research-activity/preview-questionary'];
        this.app.viewport.modal(view, { researchId: questionary.resourceId, name: questionary.resourceName });
    }
};
