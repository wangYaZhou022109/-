var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.bindings = {
    researchRecord: true,
    dimensions: true
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
        return this.module.dispatch('selectDimension', { id: id });
    }
};

exports.dataForTemplate = {
    dimensions: function(data) {
        var dim = _.orderBy(data.dimensions, ['order'], ['asc']);
        return _.map(dim, function(d) {
            return D.assign(d, {
                singleMode: data.researchRecord.researchQuestionary.answerPaperRule === 2
            });
        });
    }
};
