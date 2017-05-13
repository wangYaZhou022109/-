
exports.bindings = {
    research: false
};

exports.events = {
    'click closeResearch': 'closeResearch'
};

exports.handlers = {
    closeResearch: function() {
        window.close();
    }
};
