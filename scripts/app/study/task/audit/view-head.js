exports.bindings = {
    sectionStudyProgress: false,
    task: true
};

exports.events = {
    'click audit': 'submitAudit'
};

exports.handlers = {
    submitAudit: function() {
        var me = this;
        this.module.dispatch('saveAudit').then(function() {
            me.app.viewport.modal(me.module.items.tips);
        });
    }
};
