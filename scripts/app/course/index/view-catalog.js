var $ = require('jquery');

exports.events = {
    'click sub-item-*': 'selectMenu',
    'click catalog-item-*': 'toggleCatalog'
};

exports.handlers = {
    toggleCatalog: function(id, e, target) {
        var el = $(target);

        if (el.hasClass('active')) {
            el.removeClass('active').find('.item-child').slideUp();

        }else {
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
