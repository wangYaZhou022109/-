var $ = require('jquery');
exports.events = {
    'click statistics-*': 'showStatistics'
};

exports.handlers = {
    showStatistics: function(id) {
        $(this.$('statistics-' + id)).addClass('active').siblings().removeClass('active');
        this.module.regions.main.show(this.module.items[id]);
    }
};
