var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
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
                all: true,
                noFinish: false,
                finished: false
            },
            mixin: {
                saveStatus: function(status) {
                    this.data.all = status === 'all';
                    this.data.waitJoin = status === 'wait-join';
                    this.data.waitStart = status === 'wait-start';
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
            this.models.search.saveStatus(payload.status);
            D.assign(this.models.researchRecords.params, {
                name: payload.name,
                status: payload.status
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
