// exports.type = 'form';

exports.bindings = {
    state: true
};

exports.events = {
    'click select-depot': 'showDepotTree'
};

exports.handlers = {
    showDepotTree: function() {
        this.app.viewport.modal(this.module.items.modal);
    }
};
