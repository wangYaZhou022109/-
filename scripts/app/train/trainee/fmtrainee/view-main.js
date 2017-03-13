var _ = require('lodash/collection');
var $ = require('jquery');

exports.bindings = {
    fmtrainees: true,
    state: true,
    download: false
};

exports.events = {
    'click sort*': 'showSortInput',
    'change input-sort*': 'updateSort',
    'click addTrainee': 'addTrainee',
    'click addAllTrainee': 'showMembers',
    'click importTrainee': 'importTrainee'
};

exports.actions = {
    'click delete*': 'delete',
    'click situation': 'situation',
    'click group': 'group'
};

exports.handlers = {
    showMembers: function() {
        var me = this,
            model = me.module.items['train/trainee/fmtrainee/select-member'];
        me.app.viewport.modal(model, {
            callback: function(data) {
                var classId = me.bindings.state.data;
                var params = {};
                me.app.viewport.closeModal();
                if (data) {
                    params.classId = classId.classId;
                    params.type = 0;
                    params.memberIds = data;
                    me.module.dispatch('addTrainees', params).then(function(result) {
                        var success = result[0][0];
                        var fail = result[0][1];
                        if (success === 0) {
                            this.app.message.error('添加失败！');
                        } else {
                            me.module.dispatch('init', classId);
                            this.app.message.success('添加成功' + success + '条！');
                            this.app.message.error('添加失败' + fail + '条！');
                        }
                    });
                }
            }
        });
    },
    showSortInput: function(id) {
        $(this.$('input-sort' + id)).css('display', 'block');
        $(this.$('sort' + id)).css('display', 'none');
        $(this.$('delete' + id)).css('display', 'none');
        $(this.$('shuxian' + id)).css('display', 'none');
    },
    updateSort: function(id) {
        var me = this;
        var data = {};
        var val = $(this.$('input-sort' + id)).val();
        var classId = this.bindings.state.data;
        if (isNaN(val) || val === '') {
            this.app.message.alert('请输入正整数！');
        } else {
            data.id = id;
            data.sort = val;
            me.module.dispatch('updateSort', data).then(function() {
                me.module.dispatch('init', classId);
            });
        }
        $(me.$('input-sort' + id)).css('display', 'none');
        $(me.$('sort' + id)).css('display', 'inline');
        $(me.$('delete' + id)).css('display', 'inline');
        $(this.$('shuxian' + id)).css('display', 'inline');
    },
    addTrainee: function() {
        var memberId = $(this.$('add-trainee-input')).val().trim();
        var classId = this.bindings.state.data;
        var data = {};
        var me = this;
        if (memberId === '') {
            this.app.message.alert('人员编号不能为空');
        } else {
            data.memberId = memberId;
            data.type = 0;
            data.classId = classId.classId;
            me.module.dispatch('addTrainee', data).then(function(result) {
                var code = result[0];
                if (code === 1) {
                    this.app.message.success('添加成功!');
                    me.module.dispatch('init', classId);
                } else if (code === 888) {
                    this.app.message.error('学员已存在!');
                } else if (code === 666) {
                    this.app.message.error('人员编号不存在！');
                } else if (code === 999) {
                    this.app.message.error('配额已满!');
                } else if (code === 777) {
                    this.app.message.error('尚未配额!');
                }
            });
        }
        $(this.$('add-trainee-input')).val('');
    },
    importTrainee: function() {
        var importView = this.module.items.import;
        this.app.viewport.modal(importView);
    }
};

exports.dataForActions = {
    delete: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '是否确定删除?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    delete: function() {
        var classId = this.bindings.state.data;
        this.app.message.success('删除成功!');
        this.module.dispatch('init', classId);
    },
    situation: function(data) {
        var situation = this.module.items.situation;
        if (data[0]) {
            this.app.viewport.modal(situation);
        } else {
            this.app.message.alert('尚未配额！');
        }
    },
    group: function(data) {
        var model = this.module.items.group;
        if (data[0]) {
            this.app.viewport.modal(model);
        } else {
            this.app.message.alert('尚未分组！');
        }
    }
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'fmtrainees' }
}];

exports.dataForTemplate = {
    fmtrainees: function(data) {
        var fmtrainees = data.fmtrainees,
            pageNum = this.bindings.fmtrainees.getPageInfo().page;
        _.map(fmtrainees || [], function(fmtrainee, i) {
            var e = fmtrainee;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return fmtrainees;
    },
    exportUrl: function() {
        var url = this.bindings.download.getFullUrl() + '?';
        var params = this.bindings.fmtrainees.params;
        var token = this.app.global.OAuth.token.access_token;
        params.pageSize = 100000;
        params.page = 1;
        _.map(params, function(v, k) {
            url += (k + '=' + v + '&');
        });
        url += ('access_token=' + token);
        return url;
    }
};
