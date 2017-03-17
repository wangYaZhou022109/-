exports.bindings = {
};
exports.events = {
    'click watch-detail1': 'watchDtail1',
    'click watch-detail2': 'watchDtail2'
};

exports.handlers = {
    watchDtail1: function() {
        var model = this.module.items['ask-new/management/watch-detail1'];
        this.app.viewport.modal(model);
    },
    watchDtail2: function() {
        var model = this.module.items['ask-new/management/watch-detail2'];
        this.app.viewport.modal(model);
    }
};
