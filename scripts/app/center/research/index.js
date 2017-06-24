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
            return this.get(this.models.researchRecords, { loading: true });
        },
        search: function(payload) {
            var searchModel = this.models.search,
                researchRecords = this.models.researchRecords;
            researchRecords.clear();
            D.assign(researchRecords.params, D.assign(searchModel.data, payload));
            searchModel.changed();
            return this.get(researchRecords, { loading: true });
        },
        getResearchById: function(payload) {
            return _.find(this.models.researchRecords.data, ['id', payload.id]).researchQuestionary;
        },
        enterSearch: function(payload) {
            return this.module.dispatch('search', payload);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};
