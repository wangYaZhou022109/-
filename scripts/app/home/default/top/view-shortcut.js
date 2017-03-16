var $ = require('jquery');

exports.events = {
    'click login': 'toLogin',
    'click logout': 'doLogout',
    'click register': 'toRegister',
    'click menu-*': 'taggleMenus',
    'click theme-*': 'changeTheme',
    'click search': 'showSearchMore',
    'click message-more': 'showMessage'
};

exports.handlers = {
    toLogin: function() {
        this.app.redirectToLogin();
    },

    toRegister: function() {
        this.app.redirectToRegister();
    },

    doLogout: function() {
        this.$('logoutForm').submit();
    },
    taggleMenus: function(id) {
        $(this.$('menu-' + id)).addClass('current').siblings().removeClass('current');
    },
    changeTheme: function(id) {
        document.querySelector('html').className = id;
        $(this.$('theme-' + id)).addClass('active').siblings().removeClass('active');
    },
    showSearchMore: function() {
        $(this.$('searchMore')).addClass('show');
    },

    showMessage: function() {
        var model = this.module.items['home/message'];
        this.app.viewport.modal(model);
    }
};
