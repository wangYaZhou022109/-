exports.bindings = {
    research: true
};

exports.events = {
    'click do-research': 'doResearch'
};

exports.handlers = {
    doResearch: function() {
        var me = this;
        return this.module.dispatch('getRecordByResearch').then(function() {
            me.app.viewport.modal(me.module.items['research-tips']);
        });
    }
};
