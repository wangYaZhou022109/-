var $ = require('jquery'),
    resetIndicator;

resetIndicator = function(el) {
    var indicator = $(this.$('indicator')),
        top;

    if (el.find('span').position().left === 0) {
        top = el.parents('li').length ? el.parents('li').position().top : el.position().top;
    } else {
        top = el.length ? el.find('span').position().top : 0;
    }
    indicator.css('top', top);
};

exports.events = {
    'click sub-menu-*': 'subMenuClicked',
    'click menu-*': 'menuClicked',
    'click toggle-nav-collapse': 'toggleNav'
};

exports.handlers = {
    menuClicked: function(id, e, target) {
        var el = $(target),
            url = target.getAttribute('data-menu');

        if (el.hasClass('has-child')) {
            el.toggleClass('open');
            if (el.hasClass('active')) {
                resetIndicator.call(this, el.hasClass('open') ? el.find('li.active') : el);
            } else {
                resetIndicator.call(this, $(this.$$('li.active')));
            }
            return;
        }

        if (!url) return;
        this.app.navigate(url, true);
    },

    subMenuClicked: function(id, e, target) {
        var url = target.getAttribute('data-menu');
        e.preventDefault();

        if (!url) return;
        this.app.global.uri = url;
        this.app.navigate(url, true);
    },

    toggleNav: function() {
        $('html').toggleClass('sidebar-collapsed');
        resetIndicator.call(this, $(this.$$('li.active')));
    }
};

exports.mixin = {
    active: function(hash) {
        var el = $(this.$$('[data-menu="' + hash + '"]'));
        if (!el.length) return;
        $(this.$$('li.active')).removeClass('active');
        $(this.$$('.open')).removeClass('open');

        if (el.parent().hasClass('sub')) {
            el.parents('li').addClass('active open');
        }
        el.addClass('active');

        resetIndicator.call(this, el);
    }
};

exports.afterRender = function() {
    this.active(this.app.global.uri);
};

exports.bindings = {
    menus: true
};
