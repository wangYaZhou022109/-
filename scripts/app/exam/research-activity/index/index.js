var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.items = {
    side: 'side',
    main: 'main',
    banner: 'banner',
    'research-tips': ''
};

exports.store = {
    models: {
        research: { url: '../exam/research-activity/simple-data' },
        topics: { url: '../system/topic/ids' },
        relativeResearchs: { url: '../exam/research-activity/relative-researchs' },
        relativeMembers: { url: '../exam/research-activity/relative-members' },
        down: { url: '../human/file/download' },
        researchRecord: { url: '../exam/research-record/get-by-research' },
        access: { url: '../exam/research-activity/access' }
    },
    callbacks: {
        init: function(payload) {
            var me = this,
                research = this.models.research,
                topics = this.models.topics,
                relativeResearchs = this.models.relativeResearchs,
                relativeMembers = this.models.relativeMembers,
                access = this.models.access;

            if (payload.researchId) {
                research.set({ id: payload.researchId });
                relativeResearchs.params = { researchId: payload.researchId };
                relativeMembers.params = { researchId: payload.researchId };
                access.data = { researchQuestionaryId: payload.researchId };

                return me.save(access).then(function() { // 访问量+1，同时判断调研是否取消发布
                    return me.chain(me.get(me.models.research, { loading: true }), function() {
                        D.assign(topics.params, {
                            ids: _.map(research.data.topics, 'topicId').join(',')
                        });
                        if (!topics.params.ids) return false;
                        return me.get(me.models.topics);
                    }, function() {
                        D.assign(me.models.research.data, {
                            topics: me.models.topics.data
                        });
                        me.models.research.changed();
                    }, [me.get(relativeResearchs), me.get(relativeMembers)]);
                });
            }
            return '';
        },
        getRecordByResearch: function() {
            this.models.researchRecord.clear();
            D.assign(this.models.researchRecord.params, { researchId: this.models.research.data.id });
            return this.get(this.models.researchRecord);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
