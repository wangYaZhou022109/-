var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.bindings = {
    types: true,
    state: true
};

exports.events = {
    'click prev-*': 'prev',
    'click next-*': 'next',
    'click question-*': 'selectQuestion',
    'click list-item-*': 'toggleMore'
};

exports.dataForTemplate = {
    types: function(data) {
        return _.map(data.types, function(t) {
            return D.assign(t, { singleMode: data.state.singleMode });
        });
    }
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
        this.module.dispatch('selectQuestion', { id: id });
    },
    toggleMore: function(id) {
        return this.module.dispatch('selectType', { id: id });
    }
};

exports.afterRender = function() {
};
