exports.bindings = {
    state: true
};

exports.events = {
    'click apply-topic': 'showApplyTopic'
};

exports.handlers = {
    showApplyTopic: function() {
        var model = this.module.items['ask-new/apply-topic'];
        this.app.viewport.modal(model);
    }
};
