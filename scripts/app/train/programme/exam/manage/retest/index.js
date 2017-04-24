var D = require('drizzlejs');

exports.items = {
    search: 'search',
    main: 'main',
    'exam/exam/manage/retest/add-test': { isModule: true },
    'exam/exam/exam-publish': { isModule: true }
};

exports.store = {
    models: {
        exam: {},
        retests: {
            url: '../exam/exam',
            type: 'pageable',
            root: 'items',
            params: {}
        },
        retest: {
            url: '../exam/exam'
        },
        cancel: {
            url: '../exam/exam/exam-publish'
        }
    },
    callbacks: {
        init: function(payload) {
            this.models.exam.set(payload.exam);
            this.models.retests.params.parentId = payload.exam.id;
            return this.module.dispatch('refreshList');
        },
        refreshList: function(payload) {
            D.assign(this.models.retests.params, payload);
            return this.get(this.models.retests);
        },
        cancel: function(payload) {
            var me = this;
            this.models.cancel.set(payload);
            return this.del(this.models.cancel).then(function() {
                me.app.message.success('撤销成功');
                return me.module.dispatch('refreshList');
            });
        },
        deleteRetest: function(payload) {
            var me = this;
            this.models.retest.set(payload);
            return this.del(this.models.retest).then(function() {
                me.app.message.success('删除成功');
                return me.module.dispatch('refreshList');
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
