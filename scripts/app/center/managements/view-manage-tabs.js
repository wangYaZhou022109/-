var $ = require('jquery');
exports.events = {
    'click managements-*': 'showManagements'
};

exports.handlers = {
    showManagements: function(id) {
        var prevAll;
        prevAll = $(this.$('managements-' + id)).prevAll('li');
        $(this.$('managements-' + id)).addClass('active selected');
        prevAll.addClass('active').removeClass('selected');
        $(this.$('managements-' + id)).nextAll('li').removeClass('active selected');
        this.module.regions.main.show(this.module.items[id]);
    }
};
