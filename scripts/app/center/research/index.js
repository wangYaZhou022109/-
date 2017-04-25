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
                finished: false,
                status: 'all'
            },
            mixin: {
                saveStatus: function(status) {
                    this.data.all = status === 'all';
                    this.data.waitJoin = status === 'wait-join';
                    this.data.waitStart = status === 'wait-start';
                    this.data.finished = status === 'finished';
                    this.data.status = status;
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
            this.models.search.data.name = payload.name;
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
