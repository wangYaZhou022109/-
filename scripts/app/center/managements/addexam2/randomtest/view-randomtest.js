var $ = require('jquery');
exports.events = {
    'click addtest-*': 'showAddtest',
    'click cancel': 'hideAddtest'
};

exports.handlers = {
    showAddtest: function(id) {
        $(this.$('addtest-block')).show();
        $(this.$('addsmall-' + id)).addClass('opacityshow').removeClass('opacityhide');
        $(this.$('addtest-' + id)).parent().addClass('opacityhide').removeClass('opacityshow');
    },
    hideAddtest: function() {
        $(this.$('addtest-block')).hide();
    }
};
