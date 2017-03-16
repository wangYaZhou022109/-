exports.items = {
    banner: 'banner',
    main: 'main',
    side: 'side',
    commit: 'commit'
};

exports.store = {
    models: {
        knowledge: { url: '../course-study/knowledge' },
        collect: { url: '../system/collect' },
        score: { url: '../course-study/knowledge/score' },
        download: { url: '../human/file/download' },
        recommends: { url: '../course-study/knowledge/recommend' },
    },
    callbacks: {
        init: function(payload) {
            var model = this.models.knowledge,
                collect = this.models.collect,
                recommends = this.models.recommends;
            collect.params = { businessId: payload.id };
            recommends.params = { id: payload.id };
            model.set(payload);
            return this.chain(
                this.get(model),
                this.get(collect),
                this.get(recommends)
            );
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

