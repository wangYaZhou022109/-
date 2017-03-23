exports.items = {
    main: 'main'
};
exports.store = {
    models: {
        state: { data: {} },
        userScore: { url: '../course-study/score' }
    },
    callbacks: {
        init: function(payload) {
            this.models.state.set(payload);
            this.models.userScore.set({ id: payload.id });
            return this.get(this.models.userScore);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions.data);
};
