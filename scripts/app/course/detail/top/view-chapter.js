var $ = require('jquery');

exports.events = {
    'click note-btn': 'showNote',
    'click toggle-catalog': 'toggleCatalog'
};

exports.handlers = {
    showNote: function() {
        $(this.module.$('course-side-catalog')).addClass('show-note');
    },

    toggleCatalog: function() {
        $(this.module.$('course-side-catalog')).toggleClass('collapse');
    }
};
