var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
    main: 'main',
    'research-tips': ''
};

exports.store = {
    models: {
        researchRecords: {
            url: '../exam/research-activity/person-center-list',
            type: 'pageable',
            root: 'items'
        },
        search: {}
    },
    callbacks: {
        init: function() {
            return this.get(this.models.researchRecords);
        },
        search: function(payload) {
            D.assign(this.models.search.data, payload);
            D.assign(this.models.researchRecords.params, payload);
            return this.get(this.models.researchRecords);
        },
        getResearchById: function(payload) {
            return _.find(this.models.researchRecords.data, ['id', payload.id]).researchQuestionary;
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};
