// exports.type = 'form';

exports.bindings = {
    state: true
};

exports.events = {
    'click select-depot': 'showDepotTree'
};

exports.handlers = {
    showDepotTree: function() {
        var canShowModal = this.module.renderOptions.canShowModal;
        if (canShowModal) {
            canShowModal() ? this.app.viewport.modal(this.module.items.modal)
                : this.app.message.error(this.module.renderOptions.errorMsg);
        } else {
            this.app.viewport.modal(this.module.items.modal);
        }
    }
};

exports.dataForTemplate = {
    state: function(payload) {
        var data = payload.state;
        return data;
    }
};
