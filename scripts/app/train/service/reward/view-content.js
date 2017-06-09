exports.bindings = {
    courseSalary: true,
};
exports.actions = {
    'click edit*': 'edit'
};
exports.handlers = {
    inside: function() {
        this.app.viewport.modal(this.module.items.radio);
    },
};
exports.dataForActions = {
    edit: function(id) {
        return id;
    },
};
exports.events = {
    'click inside*': 'inside',
};
exports.actionCallbacks = {
    edit: function() {
        this.app.viewport.modal(this.module.items.edit);
    }
};

