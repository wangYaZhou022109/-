var $ = require('jquery');

exports.events = {
    'click quota-*': 'toggleQuota'
};

exports.handlers = {
    toggleQuota: function(id) {
        $(this.$('quota-' + id)).addClass('active').siblings().removeClass('active');
        $(this.$('quota-contents-' + id)).show().siblings().hide();
    }
};
