
exports.type = 'dynamic';
exports.bindings = {
    topic: true,
    topicType: true
};

exports.events = {
};

exports.handlers = {
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
