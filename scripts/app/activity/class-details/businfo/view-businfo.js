var $ = require('jquery');
exports.events = {
    'click icon-*': 'showIcon'
};

exports.handlers = {
    showIcon: function(id) {
        if ($(this.$('icon-' + id)).hasClass('icon-triangle-down')) {
            $(this.$('icon-' + id)).addClass('icon-triangle-up').removeClass('icon-triangle-down');
            $(this.$('businfo-' + id)).addClass('hide').removeClass('show');
        } else {
            $(this.$('icon-' + id)).addClass('icon-triangle-down').removeClass('icon-triangle-up');
            $(this.$('businfo-' + id)).addClass('show').removeClass('hide');
        }
    },
};
