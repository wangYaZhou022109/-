var $ = require('jquery');
exports.events = {
    'click company-*': 'showCompany'
};

exports.handlers = {
    showCompany: function(id) {
        $(this.$('company-' + id)).addClass('active').siblings().removeClass('active');
        this.module.regions.main.show(this.module.items[id]);
    }
};
