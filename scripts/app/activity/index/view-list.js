var $ = require('jquery');

exports.events = {
    'click category-item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(el) {
        $(this.$('category-item-' + el)).addClass('active').siblings().removeClass('active');
    }
};
