exports.bindings = {
};

exports.events = {
    'click changetopic': 'showTopic'
};

exports.handlers = {
    showTopic: function() {
        var model = this.module.items['ask-new/expert/changetopic'];
        this.app.viewport.modal(model);
    }
};
