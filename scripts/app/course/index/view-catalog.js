var $ = require('jquery'),
    _ = require('lodash/collection');

exports.bindings = {
    categories: true
};

exports.events = {
    'click sub-item-*': 'selectMenu',
    'click catalog-item-*': 'toggleCatalog'
};

exports.handlers = {
    toggleCatalog: function(id, e, target) {
        var el = $(target);

        if (el.hasClass('active')) {
            el.removeClass('active').find('.item-child').slideUp();
        } else {
            el.addClass('active').find('.item-child').slideDown();
            el.siblings().removeClass('active').find('.item-child').slideUp();
        }
    },

    selectMenu: function(id, e, target) {
        var el = $(target);
        e.preventDefault();
        el.addClass('active').siblings().removeClass('active');

        this.module.dispatch('selectMenu2', { id: id });
    }
};
exports.dataForTemplate = {
    menus: function() {
        // 一级导航 二级导航
        var categories = this.bindings.categories;
        return _.map(categories.filterPid(null), function(obj) {
            var d = obj || {};
            d.children = categories.filterPid(d.id);
            return d;
        });
    }
};

