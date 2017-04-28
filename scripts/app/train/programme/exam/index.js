exports.type = 'normal-grid';
exports.title = '考试管理';
exports.searchView = 'filter';

exports.items = {
    content: 'content',
    filter: '',
    'train/programme/exam/manage': { isModule: true },
    'train/programme/exam/exam-edit': { isModule: true },
    'train/programme/exam/exam-publish': { isModule: true },
    'train/programme/exam/other-module-exam': { isModule: true },
    'train/programme/paper/score-detail-paper': { isModule: true },
    'train/programme/exam/exam-edit-new': { isModule: true }
};

exports.store = {
    models: {
        exams: { url: '../exam/exam', type: 'pageable', root: 'items' },
        exam: { url: '../exam/exam' },
        cancelExam: { url: '../exam/exam/exam-publish' },
    },
    callbacks: {
        doSearch: function(options) {
            this.module.setSearchOptions(options);
        },
        refreshList: function(options) {
            var model = this.models.exams;
            model.params = options || {};
            if (model.params.status === '999') {
                delete model.params.status;
            }
            if (model.params.type === '0') {
                delete model.params.type;
            }
            return this.get(model);
        },
        getExam: function(id) {
            var exam = this.models.exam;
            exam.data.id = id;
            return this.get(exam);
        },
        cancelExam: function(payload) {
            var me = this;
            this.models.cancelExam.set(payload);
            return this.del(this.models.cancelExam).then(function() {
                me.app.message.success('撤销成功');
                return me.module.dispatch('refreshList');
            });
        },
        delExam: function(payload) {
            var me = this;
            this.models.exam.set(payload);
            return this.del(this.models.exam).then(function() {
                me.app.message.success('删除成功');
                return me.module.dispatch('refreshList');
            });
        }
    }
};

exports.afterRender = function() {
    this.dispatch('refreshList');
};
