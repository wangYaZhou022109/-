exports.items = {
    details: 'details',
    main: 'main',
    search: 'search'
};

exports.store = {
    models: {
        exams: {
            url: '../train/questionnaireSurvey/examRecord',
            type: 'pageable',
            root: 'items'
        },
        exam: { url: '../train/questionnaireSurvey/exam' },
        download: { url: '../train/questionnaireSurvey/examDownload' },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var exams = this.models.exams,
                exam = this.models.exam,
                state = this.models.state.data;
            exams.params = {};
            exams.params.resourceId = payload.id;
            exam.params.resourceId = payload.id;
            state.id = payload.id;
            this.get(exam);
            return this.get(exams);
        },
        search: function(payload) {
            var exams = this.models.exams;
            exams.params = payload;
            return this.get(exams);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions.payload);
};
