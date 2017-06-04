var _ = require('lodash/collection');
var $ = require('jquery');

exports.bindings = {
    iftrainees: true,
    state: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'iftrainees' }
}];

exports.events = {
    'click addIftrainee': 'addIftrainee',
    'click addAllIftrainee': 'showMembers'
};

exports.actions = {
    'click delete-iftrainee*': 'delete'
};

exports.handlers = {
    addIftrainee: function() {
        var memberName = $(this.$('add-iftrainee-input')).val().trim();
        var state = this.bindings.state.data;
        var params = {};
        var me = this;
        if (memberName === '') {
            me.app.message.alert('请输入人员编号!');
        } else {
            params.classId = state.classId;
            params.memberName = memberName;
            params.type = 1;
            me.module.dispatch('addIftrainee', params).then(function(result) {
                var code = result[0];
                if (code === 1) {
                    me.app.message.success('添加成功!');
                    me.module.dispatch('init', state);
                } else if (code === 666) {
                    me.app.message.error('人员编号不存在!');
                } else if (code === 888) {
                    me.app.message.error('学员已存在!');
                } else {
                    me.app.message.error('添加学员失败!请联系管理员');
                }
            });
            $(this.$('add-iftrainee-input')).val('');
        }
    },
    showMembers: function() {
        var me = this,
            view = me.module.items['train/trainee/select-member'];
        me.module.dispatch('getMemberIds').then(function(ret) {
            me.app.viewport.modal(view, {
                memberIds: ret[0],
                callback: function(data) {
                    var state = me.bindings.state.data;
                    var params = {};
                    me.app.viewport.closeModal();
                    if (data) {
                        params.classId = state.classId;
                        params.memberIds = data;
                        params.type = 1;
                        me.module.dispatch('addAllIftrainee', params).then(function(result) {
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
    delete: function(data) {
        var state = this.bindings.state.data;
        if (data[0]) {
            this.app.message.success('删除成功!');
        } else {
            this.app.message.error('删除失败!');
        }
        this.module.dispatch('init', state);
    }
};

exports.dataForTemplate = {
    iftrainees: function(data) {
        var iftrainees = data.iftrainees,
            pageNum = this.bindings.iftrainees.getPageInfo().page,
            state = this.bindings.state.data;
        _.map(iftrainees || [], function(iftrainee, i) {
            var e = iftrainee;
            e.i = i + 1 + ((pageNum - 1) * 10);
            e.isGrant = state.role !== 4;
            if (e.organizationLevel && e.organizationLevel <= 3) {
                e.companyName = e.organizationName;
                e.organizationName = '';
            }
        });
        return iftrainees;
    },
    isGrant: function() {   // 通过角色判断是否有操作权限
        var state = this.bindings.state.data;
        if (state.role !== 4) {
            return true;
        }
        return false;
    }
};
