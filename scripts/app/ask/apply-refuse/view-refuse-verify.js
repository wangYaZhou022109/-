exports.events = {
    'click reapply': 'reapply'
};
exports.handlers = {
    reapply: function() {
        var view = this.module.items['ask/expertapply'],
            me = this;
        this.app.viewport.closeModal().then(function() {
            me.app.viewport.modal(view, { callback: me.renderOptions.callback });
        });
    }
};
