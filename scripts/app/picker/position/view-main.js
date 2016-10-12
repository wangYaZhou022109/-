exports.bindings = {
    state: true
};

exports.events = {
    'click select': 'showPosition',
};

exports.handlers = {
    showPosition: function() {
        var me = this,
            model = me.module.items['picker/position/select-position'];

        me.app.viewport.modal(model, {
            callback: function(payload) {
                me.module.dispatch('selectChanged', { id: payload.id, name: payload.name });
                me.app.viewport.closeModal();
            }
        });
    }
};
