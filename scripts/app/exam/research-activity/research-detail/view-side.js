exports.bindings = {
    dimensions: true
};

exports.events = {
    'click question-*': 'selectQuestion',
    'click list-item-*': 'toggleMore'
};

exports.handlers = {
    selectQuestion: function(id) {
        return this.module.dispatch('selectQuestion', { id: id });
    },
    toggleMore: function(id) {
        return this.module.dispatch('selectDimension', { id: id });
    }
};
