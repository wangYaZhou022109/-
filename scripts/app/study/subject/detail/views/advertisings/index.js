exports.items = {
    advertising: 'advertising'
};

exports.store = {
    models: {
        region: {},
        subject: {},
        download: {
            url: '../human/file/download'
        },
        collect: { url: '../system/collect' },
        score: { url: '../course-study/course-front/score' }
    },
    callbacks: {
        init: function(options) {
            var collect = this.models.collect;
            this.models.region.set(options.region);
            this.models.subject.set(options.subject);
            collect.params = { businessId: options.subject.id };
            return this.get(collect);
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
        score: function() {
            // 评分
            var score = this.models.score,
                subject = this.models.subject;
            score.data.businessId = subject.data.id;
            score.data.businessType = 1;
            return this.save(score).then(function(data) {
                subject.data.courseScore = data[0];
                subject.changed();
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};