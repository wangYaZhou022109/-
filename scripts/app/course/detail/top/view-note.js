var $ = require('jquery');

exports.events = {
    'click cancel-edit-item-*': 'cancelEditItem',
    'click close-note': 'hideNote',
    'click add-note': 'editNote',
    'click cancel-edit': 'cancelEdit',
    'click note-item-*': 'showNoteItem',
    'click note-item-edit-*': 'editNoteItem'
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
        $(target).toggleClass('view').siblings().removeClass('view');
    },

    editNoteItem: function(id) {
        $(this.$('note-item-' + id)).addClass('editing').removeClass('view');
    },

    cancelEditItem: function(id, e) {
        e.preventDefault();

        $(this.$('note-item-' + id)).removeClass('editing');
    }
};
