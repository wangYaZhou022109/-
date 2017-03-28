exports.events = {
    'click do-research-*': 'doResearch'
};

exports.handlers = {
    doResearch: function(id) {
        var me = this;
        return this.module.dispatch('getRecordByResearch', id).then(function() {
            me.app.viewport.modal(me.module.items['research-tips']);
        });
    }
};
