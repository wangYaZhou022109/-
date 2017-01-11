exports.items = {
    pdf: 'pdf'
};

exports.store = {
    models: {
        section: {},
        sectionProgress: { url: '../course-study/course-front/submit-progress' },
        download: { url: '../human/file/preview' },
        time: { url: '../system/setting/time' },
    },
    callbacks: {
        init: function(payload) {
            this.models.section.set(payload.section);
            this.models.sectionProgress.set(payload.sectionProgress);

            return this.get(this.models.time);
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
            sectionProgress.data.finishStatus = 2; // 已完成
            sectionProgress.data.completedRate = 100; // 已完成

            this.save(sectionProgress).then(function() {
                me.module.renderOptions.callback();
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
