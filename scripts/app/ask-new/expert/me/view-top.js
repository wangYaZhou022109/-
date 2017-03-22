exports.bindings = {
};

exports.events = {
    'click changetopic': 'showTopic'
};

exports.handlers = {
    showTopic: function() {
        var model = this.module.items['picker/select-topic'];
        this.app.viewport.modal(model);
    }
};
