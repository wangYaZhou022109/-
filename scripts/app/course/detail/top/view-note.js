var $ = require('jquery');

exports.events = {
    'click cancel-edit-item-*': 'cancelEditItem',
    'click note-item-edit-*': 'editNoteItem',
    'click close-note': 'hideNote',
    'click add-note': 'editNote',
    'click cancel-edit': 'cancelEdit',
    'click note-item-*': 'showNoteItem'
};

exports.handlers = {
    hideNote: function() {
        $(this.module.$('course-side-catalog')).removeClass('show-note');
    },

    editNote: function(id, e) {
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

        $(this.$('note-item-' + id)).addClass('editing').removeClass('view').siblings().addClass('fade');
    },

    cancelEditItem: function(id, e) {
        e.preventDefault();

        $(this.$('note-item-' + id)).removeClass('editing').siblings().removeClass('fade');
    }
};
