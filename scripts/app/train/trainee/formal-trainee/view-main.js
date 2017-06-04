var _ = require('lodash/collection');
var $ = require('jquery');

exports.bindings = {
    fmtrainees: true,
    state: false,
    download: false,
    detail: false
};

exports.events = {
    'click sort*': 'showSortInput',
    'change input-sort*': 'updateSort',
    'click addTrainee': 'addTrainee',
    'click addAllTrainee': 'showMembers',
    'click importTrainee': 'importTrainee',
    'click detail*': 'detail'
};

exports.actions = {
    'click delete*': 'delete',
    'click situation': 'situation',
    'click group': 'group'
};

exports.handlers = {
    showMembers: function() {
        var me = this,
            model = me.module.items['train/trainee/select-member'];
        me.module.dispatch('getMemberIds').then(function(ret) {
            me.app.viewport.modal(model, {
                memberIds: ret[0],
                callback: function(data) {
                    var state = me.bindings.state.data;
                    var params = {};
                    me.app.viewport.closeModal();
                    if (data) {
                        params.classId = state.classId;
                        params.type = 0;
                        params.memberIds = data;
                        me.module.dispatch('addTrainees', params).then(function(result) {
                            var success = result[0][0];
                            var fail = result[0][1];
                            if (success === 0) {
                                me.app.message.error('添加失败！');
                            } else {
                                me.module.dispatch('init', state);
                                me.app.message.success('添加成功' + success + '条！');
                                if (fail !== 0) {
                                    me.app.message.error('添加失败' + fail + '条！');
                                }
                            }
                        });
                    }
                }
            });
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
        var val = $(this.$('input-sort' + id)).val().trim();
        var state = this.bindings.state.data;
        if (isNaN(val) || val === '') {
            this.app.message.alert('请输入正整数！');
        } else {
            data.id = id;
            data.sort = val;
            me.module.dispatch('updateSort', data).then(function() {
                me.module.dispatch('init', state);
            });
        }
        $(me.$('input-sort' + id)).css('display', 'none');
        $(me.$('sort' + id)).css('display', 'inline');
        $(me.$('delete' + id)).css('display', 'inline');
        $(this.$('shuxian' + id)).css('display', 'inline');
    },
    addTrainee: function() {
        var memberName = $(this.$('add-trainee-input')).val().trim();
        var state = this.bindings.state.data;
        var data = {};
        var me = this;
        if (memberName === '') {
            this.app.message.alert('请输入人员编号!');
        } else {
            data.memberName = memberName;
            data.type = 0;
            data.classId = state.classId;
            me.module.dispatch('addTrainee', data).then(function(result) {
                var code = result[0];
                if (code === 1) {
                    this.app.message.success('添加成功!');
                    me.module.dispatch('init', state);
                } else if (code === 888) {
                    this.app.message.error('学员已存在!');
                } else if (code === 666) {
                    this.app.message.error('员工编号不存在！');
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
    },
    detail: function(data) {
        var id = data,
            fmtrainees = this.bindings.fmtrainees.data,
            view = this.module.items.detail;
        this.bindings.detail.data = _.find(fmtrainees, ['id', id]);
        this.bindings.detail.changed();
        this.app.viewport.modal(view);
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
        var state = this.bindings.state.data;
        this.app.message.success('删除成功!');
        this.module.dispatch('init', state);
    },
    situation: function(data) {
        var situation = this.module.items.situation;
        if (data[0]) {
            this.app.viewport.modal(situation);
        } else {
            this.app.message.alert('尚未配额！');
        }
    },
    group: function() {
        var model = this.module.items.group;
        this.bindings.state.data.index = 0;
        this.app.viewport.modal(model);
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'fmtrainees' }
}];

exports.dataForTemplate = {
    fmtrainees: function(data) {
        var fmtrainees = data.fmtrainees,
            pageNum = this.bindings.fmtrainees.getPageInfo().page,
            state = this.bindings.state.data;
        _.map(fmtrainees || [], function(fmtrainee, i) {
            var e = fmtrainee;
            e.i = i + 1 + ((pageNum - 1) * 10);
            e.isGrant = state.role !== 4;
            if (e.organizationLevel && e.organizationLevel <= 3) {
                e.companyName = e.organizationName;
                e.organizationName = '';
            }
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
    },
    isGrant: function() {   // 通过角色判断是否有操作权限
        var state = this.bindings.state.data;
        if (state.role !== 4) {
            return true;
        }
        return false;
    }
};
