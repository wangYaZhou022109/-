exports.items = {
    pannel: 'pannel',
    'exam-tips': '',
    'research-tips': ''
};

exports.store = {
    models: {
        region: {},
        subject: {},
        state: {},
        updateProgress: {
            url: '../course-study/course-front/doc-progress'
        },
        researchActivity: {
            url: '../exam/research-activity'
        }
    },
    callbacks: {
        init: function(options) {
            var subject = options.subject,
                studyProgress = subject.studyProgress,
                courseChapters = subject.courseChapters,
                courseChapterSections = courseChapters[0].courseChapterSections;
            if (studyProgress && (!studyProgress.currentChapterId || !studyProgress.currentSectionId)) {
                studyProgress.currentChapterId = courseChapters[0].id;
                studyProgress.currentSectionId = courseChapterSections[0].id;
                subject.studyProgress = studyProgress;
            }
            this.models.region.set(options.region);
            this.models.subject.set(subject);
            this.models.state.set(options.state);
        },
        updateProgress: function(payload) {
            var model = this.models.updateProgress;
            model.set(payload);
            return this.post(model);
        },
        getResearchById: function(payload) {
            var model = this.models.researchActivity;
            model.set({ id: payload.id });
            return this.get(model);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
