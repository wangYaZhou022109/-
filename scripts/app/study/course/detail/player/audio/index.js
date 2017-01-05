var D = require('drizzlejs');

exports.items = {
    audio: 'audio'
};

exports.store = {
    models: {
        section: {},
        sectionProgress: { url: '../course-study/course-front/progress' },
        download: { url: '../human/file/download' },
        time: { url: '../system/setting/time' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var section = this.models.section,
                sectionProgress = this.models.sectionProgress,
                time = this.models.time;
            D.assign(section.data, {}, payload.section);
            D.assign(sectionProgress.data, {}, payload.sectionProgress);
            return this.get(time);
        },
        time: function() {
            var time = this.models.time;
            return this.get(time);
        },
        updatePregress: function(payload) {
            var me = this,
                section = me.models.section,
                sectionProgress = me.models.sectionProgress,
                studyTotalTime = sectionProgress.data.studyTotalTime || 0;
            sectionProgress.clear();
            sectionProgress.set(payload);
            sectionProgress.data.courseId = section.data.courseId;
            sectionProgress.data.chapterId = section.data.chapterId;
            sectionProgress.data.sectionId = section.data.id;
            sectionProgress.data.clientType = 0;
            sectionProgress.data.sectionType = section.data.sectionType;
            sectionProgress.data.studyTotalTime = studyTotalTime;

            this.save(sectionProgress).then(function(data) {
                me.module.renderOptions.refreshProgress.call(me, data[0]);
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
