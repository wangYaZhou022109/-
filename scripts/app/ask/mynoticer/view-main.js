
exports.bindings = {
    follow: true
};

exports.events = {
    'click follow-me-*': 'showFollowMe'
};

exports.handlers = {
    showFollowMe: function() {
        var model = this.module.items['ask/followme'];
        this.app.viewport.modal(model);
    }
};

exports.dataForTemplate = {
};
