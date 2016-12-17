var $ = require('jquery'),
    A = require('../../../util/animation');

exports.events = {
    'click note-btn': 'showNote',
    'click toggle-catalog': 'toggleCatalog'
};

exports.handlers = {
    showNote: function() {
        var courseSide = this.module.$('course-side-catalog');
        A.animate(courseSide, 'show-note');
    },

    toggleCatalog: function() {
        $(this.module.$('course-side-catalog')).toggleClass('collapse');
    }
};
