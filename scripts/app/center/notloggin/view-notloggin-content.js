var $ = require('jquery');

exports.events = {
    'click next': 'toggleView'
};

exports.handlers = {
    toggleView: function() {
        $(this.$('notloggin')).addClass('hide');
        $(this.$('loggin')).addClass('show').removeClass('hide');
    }
};

