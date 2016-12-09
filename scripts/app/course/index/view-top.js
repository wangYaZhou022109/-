var $ = require('jquery');

exports.events = {
    'click item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(el) {
        $(this.$('item-' + el)).addClass('active').siblings().removeClass('active');
    }
};
