exports.items = {
    pannel: 'pannel'
};

exports.store = {
    models: {
        region: {},
        subject: {},
        state: {},
        collect: { url: '../system/collect' }
    },
    callbacks: {
        init: function(options) {
            var subject = options.subject,
                studyProgress = subject.studyProgress,
                courseChapters = subject.courseChapters,
                collect = this.models.collect,
                courseChapterSections = courseChapters[0].courseChapterSections;
            if (studyProgress && (!studyProgress.currentChapterId || !studyProgress.currentSectionId)) {
                studyProgress.currentChapterId = courseChapters[0].id;
                studyProgress.currentSectionId = courseChapterSections[0].id;
                subject.studyProgress = studyProgress;
            }

            this.models.region.set(options.region);
            this.models.subject.set(subject);
            this.models.state.set(options.state);
            collect.params = { businessId: subject.id };
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
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
