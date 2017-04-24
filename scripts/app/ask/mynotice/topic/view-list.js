
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
    'click check-*': 'check',
    'click unfollow-topic-*': 'unfollow'
};

exports.dataForActions = {
    check: function(payload) {
        return payload;
    },
    unfollow: function(payload) {
        var data = payload;
        data.concernType = '4';
        return data;
    }
};

exports.actionCallbacks = {
};

exports.dataForTemplate = {
};
