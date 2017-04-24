var _ = require('lodash/collection');


exports.bindings = {
    questions: true,
    state: true,
    question: true,
    recovery: false,
    exportQuestion: false
};

exports.events = {
    'click add-question': 'addQuestion',
    'click preview-question-*': 'previewQuestion',
    'click edit-question-*': 'editQuestion',
    'click import': 'import',
    'click recovery-*': 'showRecovery',
    'click question-*': 'previewQuestion'
};

exports.handlers = {
    addQuestion: function() {
        var mod = this.module.items['train/programme/exam/question/add-question'];
        mod.renderOptions = null;
        this.app.viewport.popup(mod, {
            params: { organizationId: this.bindings.state.data.organizationId },
            titleType: 'add'
        });
    },
    editQuestion: function(data) {
        var mod = this.module.items['train/programme/exam/question/add-question'],
            question = this.bindings.question.getQuestionById({ id: data });
        this.app.viewport.popup(mod, { question: question, titleType: 'edit' });
    },
    previewQuestion: function(data) {
        var me = this;
        this.bindings.state.data.id = data;
        return this.module.dispatch('reloadState').then(function() {
            me.app.viewport.popup(me.module.items.preview);
        });
    },
    import: function() {
        this.app.viewport.popup(this.module.items['train/programme/exam/question/import-data']);
    },
    showRecovery: function(id) {
        var question = this.bindings.question.getQuestionById({ id: id });
        this.bindings.recovery.data = question.questionRecoverys;
        this.app.viewport.modal(this.module.items.recovery);
    }
};

exports.actions = {
    'click delete-question-*': 'deleteQuestion',
    'click publish-question-*': 'updateStatus',
    'click undo-question-*': 'updateStatus'
};

exports.dataForActions = {
    deleteQuestion: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '试题删除后无法恢复，是否确定删除该试题';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    },
    updateStatus: function(data) {
        var model = this.bindings.question,
            question = model.getQuestionById(data),
            me = this;
        return this.Promise.create(function(resolve) {
            var message = question.status === 1 ? '试题撤销后将无法引用，是否确定撤销试题' : '是否确定发布试题';
            me.app.message.confirm(message, function() {
                resolve({
                    id: data.id,
                    status: question.status === 1 ? 0 : 1
                });
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.data);
};

exports.dataForTemplate = {
    questions: function(data) {
        var pageNum = this.bindings.questions.getPageInfo().page;
        _.map(data.questions || [], function(question, i) {
            var q = question;
            q.i = i + 1 + ((pageNum - 1) * 10);
            q.isPublish = q.status === 1;
            if (q.errorRate > 0) {
                q.errorRate = (q.errorRate / 10000) + '%';
            } else {
                q.errorRate = '-';
            }
            if (!q.recoveryCount || q.recoveryCount === 0) q.recoveryCount = '-';
        });
        return data.questions;
    },
    exportQuestionUrl: function() {
        var model = this.bindings.exportQuestion,
            url = model.getFullUrl() + '?',
            token = this.app.global.OAuth.token.access_token,
            params = {};

        params.exportType = 2;
        _.map(params, function(v, k) {
            url += (k + '=' + v + '&');
        });

        url += ('access_token=' + token);
        return url;
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'questions' }
}];
