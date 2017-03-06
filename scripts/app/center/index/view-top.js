exports.bindings = {
};

exports.events = {
    'click edit-info': 'showEditInfo'
};

exports.handlers = {
    showEditInfo: function() {
        var model = this.module.items['center/edit'];
        this.app.viewport.modal(model);
    }
};
