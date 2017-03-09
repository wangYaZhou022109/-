exports.bindings = {
    state: true
};

exports.events = {
    'click apply-expert': 'showApplyExpert'
};

exports.handlers = {
    showApplyExpert: function() {
        var model = this.module.items['ask-new/apply-expert-aptitude'];
        this.app.viewport.modal(model);
    }
};
