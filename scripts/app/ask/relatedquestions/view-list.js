
exports.type = 'dynamic';
exports.bindings = {
    questions: true
};

exports.events = {
    'click question-*': 'details'
};

exports.handlers = {
    details: function(id) {
        this.app.show('content', 'ask/myquiz/details', { id: id });
    }
};

exports.dataForTemplate = {
};
