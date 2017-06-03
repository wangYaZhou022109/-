var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.bindings = {
    types: true,
    state: false
};

exports.events = {
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
    selectQuestion: function(id) {
        return this.module.dispatch('selectQuestion', { id: id });
    },
    toggleMore: function(id) {
        return this.module.dispatch('selectType', { id: id });
    }
};

exports.afterRender = function() {
};
