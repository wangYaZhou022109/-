var $ = require('jquery');

exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    menus: function(data) {
        return data.state.list;
    }
};

exports.events = {
    'click toggleNav': 'toggleNav',
    'click menu-*': 'showSidebar',
    'click back': 'backToMenu',
    'click overlay': 'backToMain'
};

exports.handlers = {
    toggleNav: function() {
        var topContent = this.module.$('top-content');
        $(topContent).toggleClass('show-menu');

        if ($(topContent).hasClass('show-tree')) {
            $(topContent).removeClass('show-menu show-tree');
        }
    },

    showSidebar: function() {
        var topContent = this.module.$('top-content');
        $(topContent).addClass('show-tree');
    },

    backToMenu: function() {
        var topContent = this.module.$('top-content');
        $(topContent).removeClass('show-tree');
    },

    backToMain: function() {
        var topContent = this.module.$('top-content');
        $(topContent).removeClass('show-menu show-tree');
    }
};
