exports.items = {
    main: 'main'
};

exports.title = '考试须知';

exports.store = {
    models: {
        exam: {
            url: '../exam/exam/user-record'
        }
    },
    callbacks: {
        init: function(payload) {
            if (payload.examId) {
                this.models.exam.set({ id: payload.examId });
                return this.get(this.models.exam);
            }
            return '';
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
