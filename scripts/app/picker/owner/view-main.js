// exports.type = 'form';

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

exports.dataForTemplate = {
    state: function(payload) {
        var data = payload.state;
        data.inputTextName = data.inputTextName || 'organizationId-text';
        data.inputName = data.inputName || 'organizationId';
        return data;
    }
};
