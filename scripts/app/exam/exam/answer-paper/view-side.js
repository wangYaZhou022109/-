
exports.bindings = {
    types: true,
    state: false
};

exports.events = {
    'click prev-*': 'prev',
    'click next-*': 'next',
    'click question-*': 'selectQuestion',
    'click list-item-*': 'toggleMore'
};

exports.handlers = {
    prev: function(id, e) {
        e.preventDefault();
        return this.module.dispatch('move', { id: id, offset: -1 });
    },
    next: function(id, e) {
        e.preventDefault();
        return this.module.dispatch('move', { id: id, offset: 1 });
    },
    selectQuestion: function(id) {
        return this.module.dispatch('selectQuestion', { id: id });
    },
    toggleMore: function(id) {
        return this.module.dispatch('selectType', { id: id });
    }
};

exports.afterRender = function() {
};
