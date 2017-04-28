exports.events = {
    'click rich-text-*': 'showRichText'
};

exports.bindings = {
    state: true
};

exports.handlers = {
    showRichText: function() {
        this.app.viewport.modal(this.module.items.modal);
    }
};
