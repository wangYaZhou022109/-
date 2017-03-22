exports.bindings = {
};
exports.events = {
    'click question': 'showQuestion',
    'click attention-*': 'showContent'
};
exports.handlers = {
    showQuestion: function() {
        var model = this.module.items['ask-new/publish-question'];
        this.app.viewport.modal(model);
    },
    showContent: function() {
        var model = this.module.items['ask-new/index/attention'];
        this.app.viewport.modal(model);
    }
};
