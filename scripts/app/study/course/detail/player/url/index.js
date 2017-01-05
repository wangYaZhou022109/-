exports.items = {
    url: 'url'
};

exports.store = {
    models: {
        section: {},
        sectionProgress: { url: '../course-study/course-front/progress' },
        time: { url: '../system/setting/time' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var section = this.models.section,
                sectionProgress = this.models.sectionProgress,
                time = this.models.time;
            section.set(payload.section);
            sectionProgress.set(payload.sectionProgress);
            return this.get(time);
        },
        time: function() {
            var time = this.models.time;
            return this.get(time);
        },
        updatePregress: function(payload) {
            var sectionProgress = this.models.sectionProgress,
                section = this.models.section,
                me = this;
            sectionProgress.clear();
            sectionProgress.set(payload);
            sectionProgress.data.courseId = section.data.courseId;
            sectionProgress.data.sectionId = section.data.id;
            sectionProgress.data.chapterId = section.data.chapterId;
            sectionProgress.data.clientType = 0;
            sectionProgress.data.sectionType = section.data.sectionType;

            this.save(sectionProgress).then(function(data) {
                me.module.renderOptions.refreshProgress.call(me, data[0]);
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
