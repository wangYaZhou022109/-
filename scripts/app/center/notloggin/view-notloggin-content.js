var $ = require('jquery');

exports.events = {
    'click next': 'toggleView',
    'click besure': 'showBesure'
};

exports.handlers = {
    toggleView: function() {
        $(this.$('notloggin')).addClass('hide');
        $(this.$('loggin')).addClass('show').removeClass('hide');
    },
    showBesure: function() {
        $(this.$('notloggin')).addClass('show').removeClass('hide');
        $(this.$('loggin')).addClass('hide').removeClass('show');
    }
};

