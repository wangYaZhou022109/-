var $ = require('jquery');

exports.bindings = {
    activitys: true
};

exports.events = {
    'click category-item-*': 'toggleItem',
    'click show-paper': 'showPaper'
};

exports.handlers = {
    toggleItem: function(el) {
        $(this.$('category-item-' + el)).addClass('active').siblings().removeClass('active');
    },
    showPaper: function() {
    }
};
