var $ = require('jquery');
exports.events = {
    'click highedit-*': 'showHightedit',
    'click delete-*': 'deleteItem'
};

exports.handlers = {
    showHightedit: function() {
        var model = this.module.items['center/managements/addevaluation/newevaluation/choosequestion/highedit'];
        this.app.viewport.modal(model);
    },
    deleteItem: function(id) {
        $(this.$('deletecot-' + id)).hide();
    }
};

