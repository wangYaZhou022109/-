
exports.type = 'dynamic';
exports.bindings = {
    expert: true
};

exports.events = {
    'click expert-*': 'details'
};

exports.handlers = {
    details: function(id) {
        if (id === 'more') {
            this.app.show('content', 'ask/expert');
        } else {
            this.app.show('content', 'ask/expertdetails', { id: id });
        }
    }
};

exports.dataForTemplate = {
};
