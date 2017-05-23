exports.bindings = {
};

exports.events = {
    'click changetopic': 'showTopic',
    'click right': 'showRight',
    'click editsummary': 'showEditsummary'
};

exports.handlers = {
    showTopic: function() {
        var model = this.module.items['picker/select-topic'];
        this.app.viewport.modal(model);
    },
    showRight: function() {
        var model = this.module.items['ask-new/expert/right'];
        this.app.viewport.modal(model);
    },
    showEditsummary: function() {
        var model = this.module.items['ask-new/expert/editsummary'];
        this.app.viewport.modal(model);
    }
};
