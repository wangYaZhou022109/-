exports.bindings = {
    expert: true
};

exports.events = {
    'click change-topic-*': 'changetopic'
};
exports.handlers = {
    changetopic: function(payload) {
        var model = this.module.items['ask/changetopic'];
        this.app.viewport.modal(model, { id: payload });
    }
};
exports.dataForTemplate = {
};
