var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    strings = require('./app/util/strings');

exports.items = {
    'depot-tree': 'depot-tree'
};

exports.store = {
    models: {
        questionDepots: {
            url: '../exam/question-depot',
            mixin: {
                merge: function(list) {
                    var me = this,
                        obj = {};
                    _.forEach(list, function(l) {
                        me.data.unshift(l);
                    });
                    _.forEach(this.data, function(d) {
                        obj[d.id] = d;
                    });
                    this.data = _.map(obj, function(v) {
                        return v;
                    });
                }
            }
        },
        questionDepot: { url: '../exam/question-depot' },
        shareAndPublic: { url: '../exam/question-depot/share-public', cache: true }, //  上级允许下级的目录，和 所有公开的
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var questionDepots = this.models.questionDepots;
                // shareAndPublic = this.models.shareAndPublic,
                // me = this;

            if (payload.callback) {
                this.models.state.callback = payload.callback;
            }
            D.assign(questionDepots.params, payload.data, {
                organizationId: null,
                state: 1
            });
            // return this.get(questionDepots).then(function() {
            //     // return me.get(shareAndPublic).then(function() {
            //     //     questionDepots.merge(shareAndPublic.data);
            //     // });
            //     questionDepots.changed();
            // });
        },
        changeDepot: function(payload) {
            this.models.state.callback({
                questionDepotId: payload.id,
                questionDepot: payload.questionDepot
            });
        },
        refreshTree: function(payload) {
            var questionDepots = this.models.questionDepots;
                // shareAndPublic = this.models.shareAndPublic,
                // me = this;
            D.assign(questionDepots.params, payload);
            return this.get(questionDepots).then(function() {
                // return me.get(shareAndPublic).then(function() {
                //     questionDepots.merge(shareAndPublic.data);
                // });
                questionDepots.changed();
            });
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

exports.mixin = {
    refreshTree: function(payload) {
        return this.dispatch('refreshTree', payload);
    }
};
