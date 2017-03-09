exports.bindings = {
    state: true
};

exports.events = {
    'click follow-me': 'showFollowMe'
};

exports.handlers = {
    showFollowMe: function() {
        var model = this.module.items['ask-new/follow-me'];
        this.app.viewport.modal(model);
    }
};
