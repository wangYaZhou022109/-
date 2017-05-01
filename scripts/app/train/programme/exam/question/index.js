var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.searchView = 'filter';

exports.items = {
    content: 'content',
    filter: '',
    preview: '',
    'train/programme/exam/question/add-question': { isModule: true },
    'train/programme/exam/question/import-data': { isModule: true },
    recovery: ''
};

exports.store = {
    models: {
        questions: {
            url: '../exam/question',
            root: 'items',
            type: 'pageable'
        },
        question: {
            url: '../exam/question',
            mixin: {
                getQuestionById: function(data) {
                    var questions = this.module.store.models.questions.data;
                    return _.find(questions, ['id', data.id]);
                },
                structQuestion: function(question) {
                    var q = question;
                    q.organizationId = q.organization.id;
                    q.value = JSON.stringify(q.questionAttrs);
                    return q;
                }
            }
        },
        publish: {
            url: '../exam/question/publish'
        },
        state: { data: {} },
        recovery: {},
        exportQuestion: { url: '../exam/question/export' }
    },
    callbacks: {
        init: function(payload) {
            this.models.state.set(payload.data);
        },
        doSearch: function(options) {
            this.module.setSearchOptions(options);
        },
        refreshList: function(payload) {
            D.assign(this.models.questions.params, payload);
            return this.get(this.models.questions);
        },
        updateStatus: function(payload) {
            var model = this.models.publish,
                me = this;
            model.set(payload);
            return this.put(this.models.publish).then(function() {
                var message = payload.status === 1 ? '发布成功' : '撤销成功';
                me.app.message.success(message);
                me.get(me.models.questions);
            });
        },
        deleteQuestion: function(payload) {
            var me = this;
            this.models.question.set(payload);
            return this.del(this.models.question).then(function() {
                me.app.message.success('删除成功');
                me.get(me.models.questions);
            });
        },
        reloadState: function() {
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.mixin = {
    refreshList: function(params) {
        return this.dispatch('refreshList', params);
    },
    topSearch: function() {
        var mod = this.items.filter;
        this.app.viewport.popup(mod);
    }
};
