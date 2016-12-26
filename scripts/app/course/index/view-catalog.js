var $ = require('jquery'),
    _ = require('lodash/collection');

exports.bindings = {
    categories: true
};


exports.handlers = {
    toggleCatalog: function() {
        var ele = this.$$('.catalog-view')[0];
        ele.hidden = !ele.hidden;
    }
};
exports.events = {
    'click sub-item-*': 'selectMenu',
    'click catalog-item-*': 'toggleCatalog',
    'click openCatalog': 'openCatalog',
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

        this.module.dispatch('search', { categoryId: id });
    },

    selectMenu: function(id, e, target) {
        var el = $(target);
        e.preventDefault();
        el.addClass('active').siblings().removeClass('active');

        return this.chain([
            this.module.dispatch('search', { categoryId: id }),
            this.module.dispatch('selectMenu2', { id: id })
        ]);
    },

    openCatalog: function() {
        this.module.items.catalogs.$$('.catalog-view')[0].hidden = false;
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

