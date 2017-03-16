exports.bindings = {
    expert: true
};

exports.events = {
    'click change-topic': 'changetopic'
};
exports.handlers = {
    changetopic: function() {
        var model = this.module.items['ask/changetopic'];
        this.app.viewport.modal(model);
    }
};
exports.dataForTemplate = {
};
