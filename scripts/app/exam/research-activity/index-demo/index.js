var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        research: {
            url: '../exam/research-activity/simple-data'
        },
        topics: {
            url: '../system/topic/ids'
        },
        relativeResearchs: {
            url: '../exam/research-activity/relative-researchs'
        },
        relativeMembers: {
            url: '../exam/research-activity/relative-members'
        }
    },
    callbacks: {
        init: function(payload) {
            var me = this,
                research = this.models.research,
                topics = this.models.topics,
                relativeResearchs = this.models.relativeResearchs,
                relativeMembers = this.models.relativeMembers;

            if (payload.researchId) {
                research.set({ id: payload.researchId });
                relativeResearchs.params = { researchId: payload.researchId };
                relativeMembers.params = { researchId: payload.researchId };

                return this.chain(this.get(this.models.research), function() {
                    D.assign(topics.params, {
                        ids: _.map(research.data.topics, 'topicId').join(',')
                    });
                    return me.get(this.models.topics);
                }, function() {
                    D.assign(me.models.research.data, {
                        topics: me.models.topics.data
                    });
                    me.models.research.changed();
                }, [me.get(relativeResearchs), me.get(relativeMembers)]);
            }
            return '';
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
