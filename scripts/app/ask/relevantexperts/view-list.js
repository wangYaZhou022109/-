exports.type = 'dynamic';
exports.bindings = {
    expert: true
};

exports.events = {
    'click expert-*': 'details',
    'click relevantexperts': 'showexpert'
};

exports.handlers = {
    details: function(id) {
        this.app.show('content', 'ask/expertdetails', { id: id });
    },
    showexpert: function() {
        this.app.show('content', 'ask/expert');
    }
};

exports.dataForTemplate = {
};
