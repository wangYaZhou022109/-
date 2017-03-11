exports.events = {
    'click question': 'showQuestion'
};

exports.handlers = {
    showQuestion: function() {
        var model = this.module.items['ask-new/publish-question'];
        this.app.viewport.modal(model);
    }
};
