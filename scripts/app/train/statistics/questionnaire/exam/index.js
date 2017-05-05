exports.items = {
    details: 'details',
    main: 'main',
    search: 'search',
    'train/statistics/questionnaire/exam/mark-paper': { isModule: true }
};

exports.large = true;

exports.store = {
    models: {
        exams: {
            url: '../exam/exam-record',
            type: 'pageable',
            root: 'items'
        },
        exam: { url: '../exam/exam-record/exam' },
        download: { url: '../train/questionnaire-survey/exam-download' },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var exams = this.models.exams,
                exam = this.models.exam,
                state = this.models.state;
            exams.params = {};
            exams.params.examId = payload.resourceId;
            exam.params.examId = payload.resourceId;
            state.data.resourceId = payload.resourceId;
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
