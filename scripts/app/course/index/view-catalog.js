var $ = require('jquery'),
    _ = require('lodash/collection');
var filterCategories = function(categories) {
    return function(pid) {
        return _.filter(categories, function(item) {
            return item.parentId === pid;
        });
    };
};

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
    }
};
exports.dataForTemplate = {
    menus: function(data) {
        // 一级导航 二级导航
        var getMenu = filterCategories(data.categories);
        return _.map(getMenu(null), function(obj) {
            var d = obj || {};
            d.children = getMenu(d.id);
            return d;
        });
    }
};

