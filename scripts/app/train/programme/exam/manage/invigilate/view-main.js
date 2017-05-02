var _ = require('lodash/collection');
exports.bindings = {
    examRecords: true,
    exam: true,
    exportExamRecored: false,
    params: true
};

exports.dataForTemplate = {
    examRecords: function(data) {
        _.map(data.examRecords || [], function(examRecord) {
            var m = examRecord,
                score = m.score || 0;
            if (m.clientType === 1) {
                m.clientType = 'pc';
            } else if (m.clientType === 2) {
                m.clientType = 'app';
            } else if (m.clientType === 3) {
                m.clientType = '微信';
            }
            m.score = score / 100;
            return m;
        });
        return data.examRecords;
    },
    exportUrl: function() {
        var model = this.bindings.exportExamRecored,
            url = model.getFullUrl() + '?',
            token = this.app.global.OAuth.token.access_token,
            params = this.bindings.params.data;
        _.map(params, function(v, k) {
            url += (k + '=' + v + '&');
        });
        url += ('access_token=' + token);
        return url;
    }
};

exports.events = {
    'click addMember': 'addMember',
    'click error-handle-*': 'errorHandle',
    'click detail-*': 'detail',
    'click mark-*': 'mark'
};

exports.actions = {
    'click delete-*': 'remove',
    'click enforce-*': 'forceSubmitPaper',
    'click reset-*': 'reset'
};

exports.handlers = {
    addMember: function() {
        var me = this,
            model = me.module.items['picker/member/select-member'];

        me.app.viewport.modal(model, {
            callback: function(payload) {     // 选中添加，非选中取消添加。
                me.app.viewport.closeModal();
                me.module.dispatch('addUserToExam', payload.id).then(function(data) {
                    if (data != null && data[0].msg === 'exist') {
                        me.app.message.error('该考生已在考生列表，请勿重复添加');
                    } else {
                        me.app.message.success('添加成功');
                    }
                    return me.module.dispatch('search');
                });
            }
        });
    },
    errorHandle: function(examRecordId) {
        this.app.viewport.popup(this.module.items['error-handle'], {
            examRecordId: examRecordId
        });
    },
    detail: function(id) {
        this.app.viewport.ground(this.module.items['exam/paper/score-detail-paper'], {
            examRecordId: id,
            mode: 2
        });
    },
    mark: function(id) {
        var me = this;
        this.app.viewport.ground(this.module.items['exam/paper/mark-paper'], {
            examRecordId: id,
            callback: function() {
                return me.module.dispatch('search');
            }
        });
    }
};

exports.dataForActions = {
    remove: function(payload) {
        var me = this,
            data = payload,
            message = '您确定要删除该记录吗?';
        data.status = 0;
        return me.Promise.create(function(resolve) {
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    },
    forceSubmitPaper: function(payload) {
        var me = this,
            data = payload,
            message = '您确定要执行该操作吗?';
        return me.Promise.create(function(resolve) {
            me.app.message.confirm(message, function() {
                resolve(data.id);
            }, function() {
                resolve(false);
            });
        });
    },
    reset: function(payload) {
        var me = this,
            data = payload,
            message = '您确定要执行该操作吗?';
        return me.Promise.create(function(resolve) {
            me.app.message.confirm(message, function() {
                resolve(data.id);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'examRecords' }
}];
