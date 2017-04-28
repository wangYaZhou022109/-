var _ = require('lodash/collection');

exports.bindings = {
    exams: true,
    exam: false,
    state: true,
    search: 'searchChange'
};

exports.events = {
    'click add-exam': 'addExam',
    'click publish-exam-*': 'publishExam',
    'click manage-exam-*': 'showManage',
    'click achievement': 'showAchievement',
    'click edit-exam-*': 'editExam',
    'click copy-exam-*': 'copyExam',
    'click add-exam-new': 'addExamNew'
};

exports.actions = {
    'click cancel-exam-*': 'cancelExam',
    'click delete-exam-*': 'delExam'
};

exports.handlers = {
    copyExam: function(id) {
        var view = this.module.items['exam/exam/exam-edit'];
        var that = this;
        this.app.viewport.ground(view, {
            id: id,
            isCopy: true,
            callback: function() {
                that.module.dispatch('refreshList');
            }
        });
    },
    addExam: function() {
        var view = this.module.items['exam/exam/exam-edit'];
        var that = this;
        this.app.viewport.ground(view, {
            callback: function() {
                that.module.dispatch('refreshList');
            }
        });
    },

    editExam: function(id) {
        var view = this.module.items['exam/exam/exam-edit'];
        var that = this;
        this.app.viewport.ground(view, {
            id: id,
            callback: function() {
                that.module.dispatch('refreshList');
            }
        });
    },

    showAchievement: function() {
        var model = this.module.items['exam/exam/achievement'];
        this.app.viewport.ground(model);
    },

    showManage: function(id) {
        var model = this.module.items['exam/exam/manage'];
        this.app.viewport.ground(model, { id: id });
    },

    publishExam: function(id) {
        var view = this.module.items['exam/exam/exam-publish'],
            that = this;
        return this.Promise.create(function(resolve) {
            var message = '确认发布该数据吗';
            that.app.message.confirm(message, function() {
                this.app.viewport.popup(view, {
                    id: id,
                    callback: function() {
                        that.app.message.success('发布成功');
                        that.module.dispatch('refreshList');
                    }
                });
            }, function() {
                resolve(false);
            });
        });
    },
    addExamNew: function() {
        var model = this.module.items['exam/exam/exam-edit-new'];
        this.app.viewport.ground(model);
    }
};

exports.dataForActions = {
    cancelExam: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '撤销后的考卷前端用户将无法查看，是否确定撤销该考试';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    },
    delExam: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '考试删除后将无法恢复，是否确定删除该考试';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    }
};


exports.components = [
    { id: 'pager', name: 'pager', options: { model: 'exams' } }
];

exports.dataForTemplate = {
    exams: function(data) {
        var pageNum = this.bindings.exams.getPageInfo().page;
        _.map(data.exams || [], function(role, i) {
            var r = role;
            r.i = i + 1 + ((pageNum - 1) * 10);
        });
        return data.exams;
    }
};

exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.data);
};
