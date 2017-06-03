var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
    filter: 'filter',
    main: 'main'
};

exports.store = {
    models: {
        down: { url: '../human/file/download' },
        researchRecords: {
            url: '../exam/research-activity/person-center-list',
            type: 'pageable',
            root: 'items'
        },
        search: {
            data: {
                joinTimeOrderBy: 0
            }
        }
    },
    callbacks: {
        init: function() {
            return this.get(this.models.researchRecords);
        },
        search: function(payload) {
            var searchModel = this.models.search,
                researchRecords = this.models.researchRecords;
            researchRecords.clear();
            D.assign(researchRecords.params, D.assign(searchModel.data, payload));
            searchModel.changed();
            return this.get(researchRecords);
        },
        getResearchById: function(payload) {
            return _.find(this.models.researchRecords.data, ['id', payload.id]).researchQuestionary;
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};
