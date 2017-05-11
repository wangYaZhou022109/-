exports.bindings = {
    state: true
};

exports.events = {
    'click apply-expert': 'showApplyExpert',
    'click verify': 'showVerify'
};

exports.handlers = {
    showApplyExpert: function() {
        var model = this.module.items['ask-new/apply-expert-aptitude'];
        this.app.viewport.modal(model);
    },
    showVerify: function() {
        var model = this.module.items['ask-new/apply-verify'];
        this.app.viewport.modal(model);
    },
};
