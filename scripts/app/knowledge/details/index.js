exports.items = {
    banner: 'banner',
    main: 'main',
    side: 'side',
    commit: 'commit',
    'knowledge/index/modal': { isModule: true }
};

exports.store = {
    models: {
        knowledge: { url: '../course-study/knowledge/front' },
        collect: { url: '../system/collect' },
        score: { url: '../course-study/knowledge/score' },
        download: { url: '../human/file/download' },
        recommends: { url: '../course-study/knowledge/recommend' },
        integral: { url: '../system/integral-result', autoLoad: 'after' },
        readerMembers: { url: '../course-study/knowledge/readerMembers' }
    },
    callbacks: {
        init: function(payload) {
            var me = this,
                model = this.models.knowledge,
                collect = this.models.collect,
                recommends = this.models.recommends,
                readerMembers = this.models.readerMembers;
            collect.params = { businessId: payload.id };
            recommends.params = { id: payload.id };
            model.set(payload);
            this.get(collect);
            this.get(recommends);
            return this.get(model).then(function(data) {
                var knowledgeId = data[0].id;
                readerMembers.params = { knowledgeId: knowledgeId };
                me.get(readerMembers);
            });
        },
        score: function() {
            // 评分
            var score = this.models.score,
                knowledge = this.models.knowledge;
            score.data.id = knowledge.data.id;
            return this.save(score).then(function(data) {
                knowledge.data.avgScore = data[0].avg;
                knowledge.changed();
            });
        },
        collect: function(payload) {
            var collect = this.models.collect;
            collect.set(payload);
            return this.save(collect);
        },
        cancelCollect: function(payload) {
            var collect = this.models.collect;
            collect.set(payload);
            return this.del(collect, { slient: true }).then(function() {
                collect.set({}, true);
            });
        },
        changeRecommends: function() {
            var recommends = this.models.recommends;
            recommends.params = { id: this.models.knowledge.data.id };
            this.get(recommends);
        }
    }
};
exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

