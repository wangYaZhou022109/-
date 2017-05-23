exports.bindings = {
    question: true
};
exports.type = 'form';

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function(payload) {
        return payload;
    }
};
