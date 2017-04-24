
exports.type = 'dynamic';
exports.bindings = {
    experts: true,
    topicType: true
};

exports.events = {
};

exports.handlers = {
};
exports.actions = {
    'click check-*': 'check',
    'click unfollow-expert-*': 'unfollow'
};

exports.dataForActions = {
    check: function(payload) {
        return payload;
    },
    unfollow: function(payload) {
        var data = payload;
        data.concernType = '1';
        return data;
    }
};


exports.actionCallbacks = {
};

exports.dataForTemplate = {
};
