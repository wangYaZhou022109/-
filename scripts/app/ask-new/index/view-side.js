exports.bindings = {
};
exports.events = {
    'click question': 'showQuestion',
    'click attention-content': 'showContent',
    'click attention-topic': 'showTopic',
    'click attention-expert': 'showExpert'
};
exports.handlers = {
    showQuestion: function() {
        var model = this.module.items['ask-new/publish-question'];
        this.app.viewport.modal(model);
    },
    showContent: function() {
        var model = this.module.items['ask-new/index/attention'];
        this.app.viewport.modal(model);
    },
    showTopic: function() {
        var model = this.module.items['ask-new/index/attention'];
        this.app.viewport.modal(model);
    },
    showExpert: function() {
        var model = this.module.items['ask-new/index/attention'];
        this.app.viewport.modal(model);
    }
};
