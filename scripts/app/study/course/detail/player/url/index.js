exports.items = {
    url: 'url'
};

exports.store = {
    models: {
        updateProgress: { url: '../course-study/course-front/doc-progress' },
        time: { url: '../system/setting/time' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                time = this.models.time;
            state.set(payload);
            return this.get(time);
        },
        updatePregress: function(payload) {
            var updateProgress = this.models.updateProgress;
            updateProgress.set(payload);
            return this.save(updateProgress);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
