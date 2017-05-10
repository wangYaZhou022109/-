exports.bindings = {
    state: true,
    types: true
};

exports.events = {
    'click question-*': 'selectQuestion',
    'click list-item-*': 'toggleMore'
};

exports.handlers = {
    selectQuestion: function(id) {
        this.module.dispatch('selectQuestion', { id: id });
    },
    toggleMore: function(id) {
        return this.module.dispatch('selectType', { id: id });
    }
};
