exports.bindings = {
    exam: true,
    retests: true
};

exports.events = {
    'click add-retest': 'addReTest',
    'click edit-*': 'editReTest',
    'click delete-*': 'deleteRetest',
    'click publish-*': 'publishRetest',
    'click cancel-*': 'cancelRetest'
};

exports.handlers = {
    addReTest: function() {
        var mod = this.module.items['exam/exam/manage/retest/add-test'],
            me = this,
            retests = this.bindings.retests.data,
            exam = this.bindings.exam.data;

        this.app.viewport.popup(mod, {
            exam: exam,
            callback: function() {
                return me.module.dispatch('refreshList');
            },
            num: this.bindings.retests.getPageInfo().total + 1,
            latestExamId: retests.length > 0 ? retests[0].id : exam.id
        });
    },
    editReTest: function(id) {
        var mod = this.module.items['exam/exam/manage/retest/add-test'],
            me = this,
            retests = this.bindings.retests.data,
            exam = this.bindings.exam.data;

        this.app.viewport.popup(mod, {
            exam: exam,
            id: id,
            callback: function() {
                return me.module.dispatch('refreshList');
            },
            latestExamId: retests.length > 0 ? retests[0].id : exam.id
        });
    },
    deleteRetest: function(id) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定要删除该数据?';
            me.app.message.confirm(message, function() {
                return me.module.dispatch('deleteRetest', { id: id });
            }, function() {
                resolve(false);
            });
        });
    },
    publishRetest: function(id) {
        var me = this;
        this.app.viewport.popup(this.module.items['exam/exam/exam-publish'], {
            id: id,
            callback: function() {
                return me.module.dispatch('refreshList');
            }
        });
    },
    cancelRetest: function(id) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定要取消发布吗?';
            me.app.message.confirm(message, function() {
                return me.module.dispatch('cancel', { id: id });
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.dataForTemplate = {
    retests: function(data) {
        return data.retests;
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'retests' }
}];
