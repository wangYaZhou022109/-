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
        if (name !== '') {
            this.module.dispatch('addGroup', { name: name });
        } else {
            this.app.message.alert('分组名称不能为空');
            $(this.$('add-group-input')).val('');
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
        $(this.$('input-group-name' + id)).css('display', 'block');
        $(this.$('label-group-name' + id)).css('display', 'none');
    },
    updateName: function(id) {
        var val = $(this.$('input-group-name' + id)).val().trim();
        if (val === '') {
            this.app.message.alert('分组名称不能为空');
        } else {
            this.module.dispatch('changeName', { id: id, name: val });
        }
    },
    manage: function(id) {
        var view = this.module.items['train/trainee/fmtrainee/group-manage'];
        var state = this.bindings.state.data;
        state.groupId = id;
        this.app.viewport.modal(view, state);
    }
};

exports.actions = {
    'click group-trainee*': 'groupTrainees'
};

exports.dataForActions = {
    groupTrainees: function(id) {
        this.bindings.state.data.groupId = id.id;
    }
};

exports.actionCallbacks = {
    saveGroup: function() {
        this.app.message.success('保存成功!');
    },
    groupTrainees: function() {
        var view = this.module.items.groupTrainees;
        this.app.viewport.modal(view);
    }
};

exports.dataForTemplate = {
    group: function(data) {
        var group = data.group;
        _.map(group || [], function(g, i) {
            var e = g;
            e.i = i + 1;
        });
        return group;
    }
};
