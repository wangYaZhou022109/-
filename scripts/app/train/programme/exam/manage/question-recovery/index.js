exports.items = {
    main: 'main',
    detail: ''
};

exports.store = {
    models: {
        questions: {
            url: '../exam/question-recovery/exam-questions',
            type: 'pageable',
            root: 'items'
        },
        exam: {},
        state: {}
    },
    callbacks: {
        init: function(payload) {
            this.models.exam.set(payload.exam);
            this.models.questions.params = { examId: payload.exam.id };
            return this.get(this.models.questions);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
