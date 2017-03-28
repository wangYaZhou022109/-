var $ = require('jquery');
exports.events = {
    'click managements-tab-*': 'showManagements'
};

exports.handlers = {
    showManagements: function(id) {
        $(this.$('managements-tab-' + id)).addClass('active').prevAll('li').addClass('active');
        $(this.$('managements-tab-' + id)).nextAll('li').removeClass('active');
    }
};
