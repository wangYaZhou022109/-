
exports.type = 'dynamic';
exports.bindings = {
    expertlist: true,
    topicType: true,
    user: true
};

exports.events = {
    'click expert-activate*': 'activate',
    'click expert-myself*': 'myself',
    'click expert-apply*': 'apply',
    'click expert-*': 'details'
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
    },
    details: function(id) {
        this.app.show('content', 'ask/expertdetails', { id: id });
    }
};

exports.actions = {
    'click check-*': 'check'
};

exports.dataForActions = {
    check: function(payload) {
        return payload;
    }
};

exports.actionCallbacks = {
};

exports.dataForTemplate = {
};
