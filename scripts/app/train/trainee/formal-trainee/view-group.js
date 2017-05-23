var _ = require('lodash/collection');
var $ = require('jquery');
exports.title = '学员分组';

exports.bindings = {
    group: true,
    state: true
};

exports.buttons = [{
    text: '保存',
    action: 'saveGroup'
}];

exports.events = {
    'click addGroup': 'addGroup',
    'click delGroup*': 'delGroup',
    'click go-up*': 'moveUp',
    'click go-down*': 'moveDown',
    'click label-group-name*': 'showNameInput',
    'change input-group-name*': 'updateName',
    'click manage*': 'manage'
};

exports.handlers = {
    addGroup: function() {
        var name = $(this.$('add-group-input')).val().trim();
        var group = this.bindings.group.data;
        var me = this;
        if (name !== '') {
            if (_.find(group, ['name', name])) {
                me.app.message.alert('分组名称不能重复!');
            } else {
                me.module.dispatch('addGroup', { name: name });
            }
        } else {
            me.app.message.alert('分组名称不能为空!');
            $(me.$('add-group-input')).val('');
        }
    },
    delGroup: function(id) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定删除此分组么?';
            me.app.message.confirm(message, function() {
                me.module.dispatch('delGroup', id);
            }, function() {
                resolve(false);
            });
        });
    },
    moveUp: function(id) {
        this.module.dispatch('moveUp', id);
    },
    moveDown: function(id) {
        this.module.dispatch('moveDown', id);
    },
    showNameInput: function(id) {
        var state = this.bindings.state.data;
        if (state.role !== 4) {
            $(this.$('input-group-name' + id)).css('display', 'block');
            $(this.$('label-group-name' + id)).css('display', 'none');
        }
    },
    updateName: function(id) {
        var val = $(this.$('input-group-name' + id)).val().trim();
        if (val === '') {
            this.app.message.alert('分组名称不能为空');
        } else {
            this.module.dispatch('changeName', { id: id, name: val });
        }
    },
    manage: function(id, e, target) {
        var me = this,
            view = me.module.items['train/trainee/formal-trainee/group-manage'],
            state = me.bindings.state.data,
            allGroup = me.bindings.group;
        if (id.substring(0, 4) === 'new-') {    // 如果管理的是新添加的分组，要先保存再操作
            me.module.dispatch('saveGroup').then(function() {
                me.module.dispatch('group').then(function() {
                    var groups = me.bindings.group;
                    var groupName = target.getAttribute('group-name');
                    var group = _.find(groups.data, ['name', groupName]);
                    var groupId = group.id;
                    state.groupId = groupId;
                    me.app.viewport.modal(view, {
                        state: state,
                        callback: function(count) {
                            group.traineeNumber = count;
                            groups.changed();
                        }
                    });
                });
            });
        } else {    // 如果管理的是已有的分组，直接进行操作
            state.groupId = id;
            me.app.viewport.modal(view, {
                state: state,
                callback: function(count) {
                    _.find(allGroup.data, ['id', id]).traineeNumber = count;
                    allGroup.changed();
                }
            });
        }
    }
};

exports.actions = {
    'click group-trainee*': 'groupTrainees'
};

exports.dataForActions = {
    groupTrainees: function(id) {
        this.bindings.state.data.groupId = id.id;
    },
    saveGroup: function() {
        var state = this.bindings.state.data;
        if (state.role === 4) {
            this.app.viewport.closeModal();
            return false;
        }
        return true;
    }
};

exports.actionCallbacks = {
    saveGroup: function() {
        this.app.message.success('保存成功!');
    },
    groupTrainees: function() {
        var view = this.module.items.groupTrainees,
            groupId = this.bindings.state.data.groupId,
            groups = this.bindings.group,
            group = _.find(groups.data, ['id', groupId]);
        this.app.viewport.modal(view, {
            callback: function(count) {
                group.traineeNumber = count;
                groups.changed();
            }
        });
    }
};

exports.dataForTemplate = {
    group: function(data) {
        var group = data.group;
        var state = this.bindings.state.data;
        _.map(group || [], function(g, i) {
            var e = g;
            e.i = i + 1;
            e.isGrant = state.role !== 4;
        });
        return group;
    },
    isGrant: function() {   // 通过角色判断是否有操作权限
        var state = this.bindings.state.data;
        if (state.role === 4) {
            return false;
        }
        return true;
    }
};
