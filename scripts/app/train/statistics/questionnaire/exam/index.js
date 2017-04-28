exports.items = {
    details: 'details',
    main: 'main',
    search: 'search'
};

exports.large = true;

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
                state = this.models.state;
            exams.params = {};
            exams.params.resourceId = payload.id;
            exams.params.classId = payload.classId.classId;
            exam.params.resourceId = payload.id;
            exam.params.classId = payload.classId.classId;
            state.data.resourceId = payload.id;
            state.data.classId = payload.classId.classId;
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
