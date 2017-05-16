var $ = require('jquery');
exports.events = {
    'click classmate-*': 'toggleActive'
};

exports.handlers = {
    toggleActive: function(id) {
        $(this.$('classmate-' + id)).addClass('active').siblings().removeClass('active');
    }
};
