var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    taskList: true,
    task: false,
    state: false,
    files: false
};

exports.events = {
    'click addTask': 'addTask',
    'click minimize-*': 'showMinimize'
};

exports.handlers = {
    addTask: function() {
        this.bindings.state.data.type = 'add';
        this.bindings.task.clear();
        this.bindings.files.clear();
        this.app.viewport.modal(this.module.items['edit-task']);
    },
    showMinimize: function(id) {
        $(this.$('minitable-' + id)).toggle();
        if ($(this.$('min-' + id)).text() === '最小化') {
            $(this.$('min-' + id)).text('最大化');
            $(this.$('minimize-' + id)).addClass('icon-add-full').removeClass('icon-minus-full');
        } else {
            $(this.$('min-' + id)).text('最小化');
            $(this.$('minimize-' + id)).addClass('icon-minus-full').removeClass('icon-add-full');
        }
    }
};

exports.actions = {
    'click del-task-*': 'delTask',
    'click edit-task-*': 'editTask',
};

exports.dataForActions = {
    delTask: function(payload) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定删除此作业吗?';
            me.app.message.confirm(message, function() {
                me.module.dispatch('delTask', payload);
            }, function() {
                resolve(false);
            });
        });
    },
    editTask: function(data) {
        this.bindings.state.data.type = 'update';
        return data;
    },
};

exports.actionCallbacks = {
    editTask: function() {
        this.app.viewport.modal(this.module.items['edit-task']);
    },
};

exports.dataForTemplate = {
    taskList: function(data) {
        var state = this.bindings.state.data;
        _.map(data.taskList || [], function(task, i) {
            var r = task;
            r.i = i + 1;
            r.isGrant = state.role !== 4;
        });
        return data.taskList;
    },
    isGrant: function() {
        var state = this.bindings.state.data;
        if (state.role !== 4) {
            return true;
        }
        return false;
    }
};
