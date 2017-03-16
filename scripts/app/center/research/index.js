var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
    main: 'main',
    'research-tips': '',
    'exam/research-activity/research-answer-detail': { isModule: true }
};

exports.store = {
    models: {
        researchRecords: {
            url: '../exam/research-activity/person-center-list',
            type: 'pageable',
            root: 'items'
        },
        search: {
            data: {
                all: true,
                noFinish: false,
                finished: false
            },
            mixin: {
                saveStatus: function(status) {
                    this.data.all = status === 'all';
                    this.data.noFinish = status === 'no-finish';
                    this.data.finished = status === 'finished';
                },
                getStatusInt: function(status) {
                    if (status !== 'all') {
                        if (status === 'no-finish') return 0;
                        return 1;
                    }
                    return null;
                }
            }
        }
    },
    callbacks: {
        init: function() {
            return this.get(this.models.researchRecords);
        },
        search: function(payload) {
            if (payload.status) {
                this.models.search.saveStatus(payload.status);
            }

            D.assign(this.models.researchRecords.params, {
                status: this.models.search.getStatusInt(payload.status),
                name: payload.name
            });

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
