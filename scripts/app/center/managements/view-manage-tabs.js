var $ = require('jquery');
exports.events = {
    'click managements-*': 'showManagements'
};

exports.handlers = {
    showManagements: function(id) {
        $(this.$('managements-' + id)).addClass('active').prevAll('li').addClass('active');
        $(this.$('managements-' + id)).nextAll('li').removeClass('active');
        this.module.regions.main.show(this.module.items[id]);
    }
};
