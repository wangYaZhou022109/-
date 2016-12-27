var $ = require('jquery');

exports.bindings = {
    menus: true
};

exports.dataForTemplate = {
    menus: function(data) {
        return data.menus;
    }
};

exports.events = {
    'click toggleNav': 'toggleNav',
    'click menu-*': 'showContent',
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

    showContent: function(id, e) {
        var url = $(e.target).attr('href').slice(2);
        this.app.navigate(url, true);
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
