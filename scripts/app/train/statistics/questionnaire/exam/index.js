exports.items = {
    details: 'details',
    main: 'main',
    search: 'search'
};

exports.store = {
    models: {
        exams: {
            url: '../train/questionnaire-survey/exam-record',
            type: 'pageable',
            root: 'items'
        },
        exam: { url: '../train/questionnaire-survey/exam' },
        download: { url: '../train/questionnaire-survey/exam-download' },
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
            exam.clear();
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
