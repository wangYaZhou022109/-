var D = require('drizzlejs'),
    strings = require('./app/util/strings');

exports.items = {
    'organization-selector': 'organization-selector',
    'depot-tree': 'depot-tree',
    'exam/question-depot/add-question-depot': { isModule: true }
};

exports.store = {
    models: {
        questionDepots: { url: '../exam/question-depot' },
        questionDepot: { url: '../exam/question-depot' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var questionDepots = this.models.questionDepots;

            if (payload.callback) {
                this.models.state.callback = payload.callback;
            }

            D.assign(questionDepots.params, payload.data, {
                state: '1',
                organizationId: this.app.global.currentUser.rootOrganization.id
            });

            return this.get(questionDepots);
        },
        changeOrganization: function(payload) {
            this.models.state.callback(payload);
            D.assign(this.models.questionDepots.params, payload);
            return this.get(this.models.questionDepots);
        },
        changeDepot: function(payload) {
            this.models.state.callback({ questionDepotId: payload.id });
        },
        refreshTree: function() {
            return this.get(this.models.questionDepots);
        },
        remove: function(payload) {
            var me = this;
            this.models.questionDepot.set(payload);
            return this.del(this.models.questionDepot).then(function() {
                me.app.message.success(strings.get('delete-success'));
                return me.get(me.models.questionDepots);
            });
        }
    }
};


exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};
