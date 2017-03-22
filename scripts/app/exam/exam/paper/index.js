exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        exam: {
            url: '../exam/exam-record/exam'
        }
    },
    callbacks: {
        init: function(payload) {
            if (payload.examId) {
                this.models.exam.params = { examId: payload.examId };
                return this.get(this.models.exam);
            }
            return '';
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
