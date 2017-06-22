var _ = require('lodash/collection'),
    types = [
        { id: 1, type: 1, name: '单选' },
        { id: 2, type: 2, name: '多选' },
        { id: 3, type: 3, name: '判断' },
        { id: 4, type: 8, name: '排序' },
        // { id: 5, type: 7, name: '连线' },
        { id: 6, type: 4, name: '填空' },
        { id: 7, type: 5, name: '问答' },
        { id: 8, type: 6, name: '阅读理解' }
    ];

exports.bindings = {
    paper: true,
    summary: true
};

exports.dataForTemplate = {
    summary: function() {
        var data = this.bindings.summary.data,
            rows = data.rows,
            remote = _.map(_.orderBy(types, ['id', 'asc']), function(t) {
                return {
                    total: {
                        amount: '-',
                        score: '-'
                    },
                    type: t.type,
                    typeName: t.name
                };
            });

        rows = _.map(remote, function(r) {
            var obj = _.find(rows, ['type', r.type]);
            if (obj) {
                return obj;
            }
            return r;
        });
        return { rows: rows };
    }
};

exports.events = {
    'click select-question': 'selectQuestion',
    'click temporary-question': 'temporaryQuestion',
    'click import-question': 'importQuestion'
};


exports.handlers = {
    selectQuestion: function() {
        var me = this;
        this.app.viewport.modal(this.module.items['train/programme/exam/question/select-question'], {
            url: this.module.renderOptions.url,
            name: '',
            callback: {
                addQuestionClass: function(data) {
                    return me.module.dispatch('addQuestionClass', data);
                },
                addQuestionClasses: function(data) {
                    return me.module.dispatch('addQuestionClasses', data);
                },
                removeQuestionClass: function(data) {
                    return me.module.dispatch('removeQuestionClass', data);
                },
                removeQuestionClasses: function(data) {
                    return me.module.dispatch('removeQuestionClasses', data);
                },
                getQuestionIds: function() {
                    return me.bindings.paper.getQuestionIds();
                }
            }
        });
    },
    temporaryQuestion: function() {
        var me = this;
        this.app.viewport.modal(this.module.items['train/programme/exam/question/add-question'], {
            // params: {
            //     organization: this.app.global.currentUser.rootOrganization
            // },
            callback: function(data) {
                return me.module.dispatch('addQuestionClass', data);
            },
            interim: true,
            titleType: 'add',
            isTemp: 1
        });
    },
    importQuestion: function() {
        var me = this;
        this.app.viewport.modal(this.module.items['train/programme/exam/question/import-data'], {
            templateType: 1,
            isOtherModuleType: this.module.renderOptions.isOtherModuleType,
            callback: function(data) {
                return me.module.dispatch('addQuestionClasses', data);
            },
        });
    }
};

