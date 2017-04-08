var _ = require('lodash/collection');
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
        score: { url: '../course-study/course-front/score' },
        topic: { url: '../system/topic/ids' },
        state: {}
    },
    callbacks: {
        init: function(options) {
            var collect = this.models.collect,
                topicModel = this.models.topic,
                businessTopics = options.subject.businessTopics,
                subject = this.models.subject,
                ids;
            this.models.region.set(options.region);
            this.models.state.set(options.state);
            subject.set(options.subject);
            if (businessTopics && businessTopics.length > 0) {
                ids = _.map(businessTopics, 'topicId').join(',');
                topicModel.params.ids = ids;
                this.get(topicModel).then(function(data) {
                    subject.data.businessTopics = data[0];
                    subject.changed();
                });
            }
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
                subject.data.avgScore = data[0].avgScore || subject.data.avgScore;
                subject.changed();
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
