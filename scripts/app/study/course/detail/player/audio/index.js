exports.items = {
    audio: 'audio'
};

exports.store = {
    models: {
        updateProgress: { url: '../course-study/course-front/video-progress' },
        download: { url: '../human/file/download' },
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
        updateProgress: function(payload) {
            var model = this.models.updateProgress;
            model.set(payload);
            return this.post(model);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
