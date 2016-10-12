exports.bindings = {
    state: true
};

exports.events = {
    'click select': 'showMember',
};

exports.handlers = {
    showMember: function() {
        var me = this,
            model = me.module.items['picker/member/select-member'];

        me.app.viewport.modal(model, {
            callback: function(payload) {
                me.module.dispatch('selectChanged', { id: payload.id, name: payload.name });
                me.app.viewport.closeModal();
            }
        });
    }
};
