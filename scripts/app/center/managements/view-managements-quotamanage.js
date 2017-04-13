var $ = require('jquery');

exports.events = {
    'click quota-*': 'toggleQuota',
    'click addunit': 'showAddunit'
};

exports.handlers = {
    toggleQuota: function(id) {
        $(this.$('quota-' + id)).addClass('active').siblings().removeClass('active');
        $(this.$('quota-contents-' + id)).show().siblings().hide();
    },
    showAddunit: function() {
        var model = this.module.items['center/managements/addunit'];
        this.app.viewport.modal(model);
    }
};
