var $ = require('jquery'),
    _ = require('lodash/collection');

exports.bindings = {
    notes: true,
    course: false
};

exports.events = {
    'click cancel-edit-item-*': 'cancelEditItem',
    'click note-item-edit-*': 'editNoteItem',
    'click close-note': 'hideNote',
    'click note-content': 'noteContent',
    'click cancel-edit': 'cancelEdit',
    'click note-item-*': 'showNoteItem'
};

exports.actions = {
    'click add-note': 'addNote',
    'click remove-note*': 'removeNote',
    'click update-note*': 'updateNote'
};

exports.handlers = {
    hideNote: function() {
        $(this.module.$('course-side-catalog')).removeClass('show-note');
    },

    noteContent: function(id, e) {
        $(e).parent().addClass('editing');
    },

    cancelEdit: function(id, e) {
        $(e).parents('.editing').removeClass('editing');
    },

    showNoteItem: function(id, e, target) {
        if ($(target).hasClass('view')) {
            $(target).removeClass('view').siblings().removeClass('fade');
        } else {
            $(target).addClass('view').removeClass('fade').siblings()
            .removeClass('view editing')
            .addClass('fade');
        }
    },

    editNoteItem: function(id, e) {
        e.preventDefault();

        $(this.$('note-item-' + id)).addClass('editing').removeClass('view').siblings()
        .addClass('fade');
    },

    cancelEditItem: function(id, e) {
        e.preventDefault();

        $(this.$('note-item-' + id)).removeClass('editing').siblings().removeClass('fade');
    }
};

exports.dataForActions = {
    addNote: function(payload) {
        return payload;
    },
    removeNote: function(payload) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定要删除该笔记吗?';
            me.app.message.confirm(message, function() {
                resolve(payload);
            }, function() {
                resolve(false);
            });
        });
    },
    updateNote: function(payload) {
        if (!payload.content.trim()) {
            return this.app.message.error('内容不能为空');
        }
        return payload;
    }
};

exports.actionCallbacks = {
    addNote: function() {
        return this.module.dispatch('initNotes').then(function() {
            this.app.message.success('添加成功');
        });
    },
    removeNote: function() {
        return this.module.dispatch('initNotes').then(function() {
            this.app.message.success('删除成功');
        });
    },
    updateNote: function() {
        this.module.dispatch('initNotes').then(function() {
            this.app.message.success('修改成功');
        });
    }
};

exports.dataForTemplate = {
    notes: function(data) {
        var notes = data.notes;
        _.forEach(notes, function(item, i) {
            var r = item;
            r.i = i;
        });
        return data.notes;
    }
};

