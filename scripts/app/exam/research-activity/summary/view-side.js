
exports.bindings = {
    dimensions: true
};

exports.events = {
    'click q-*': 'selectQuestion',
    'click questionaryDetail': 'questionaryDetail'
};

exports.handlers = {
    selectQuestion: function(id) {
        return this.module.dispatch('selectQuestion', { id: id });
    },
    questionaryDetail: function() {
        var view = this.module.items.description;
        this.app.viewport.modal(view);
    }
};
