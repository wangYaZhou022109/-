exports.items = {
    main: 'main',
    'activity/index/exam-prompt': { isModule: true }
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function(payload) {
            if (payload.examId) {
                this.models.state.set({ examId: payload.examId });
            }
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
