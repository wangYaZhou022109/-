exports.bindings = {
    state: true
};

exports.events = {
    'click select': 'showPicker'
};

exports.handlers = {
    showPicker: function() {
        this.app.viewport.modal(this.module.items.modal);
    }
};
