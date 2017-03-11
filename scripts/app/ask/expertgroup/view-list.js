
exports.type = 'dynamic';
exports.bindings = {
    expertlist: true
};

exports.events = {
    'click expert-activate*': 'activate',
    'click expert-myself*': 'myself',
    'click expert-apply*': 'apply'
};

exports.handlers = {
    activate: function() {
        var model = this.module.items['ask/expertactivation'];
        this.app.viewport.modal(model);
    },
    myself: function() {
        this.app.show('content', 'ask/iamexpert');
    },
    apply: function() {
        var model = this.module.items['ask/applyexpertaptitude'];
        this.app.viewport.modal(model);
    }
};

exports.actions = {
};
exports.dataForActions = {
};

exports.actionCallbacks = {
};

exports.dataForTemplate = {
};
