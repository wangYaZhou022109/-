var $ = require('jquery');
exports.evnets = {
    'click next': 'showLoggin'
};

exports.handlers = {
    showLoggin: function() {
        $(this.$('notloggin').addClass('hide'));
        $(this.$('loggin').addClass('show').removeClass('hide'));
    }
};
