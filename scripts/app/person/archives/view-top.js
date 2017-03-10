exports.bindings = {
    state: true
};

exports.events = {
    'click edit-info': 'showEditInfo'
};

exports.handlers = {
    showEditInfo: function() {
        var model = this.module.items['person/edit'];
        this.app.viewport.modal(model);
    }
};
