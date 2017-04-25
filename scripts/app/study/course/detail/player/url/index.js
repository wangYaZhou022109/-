exports.items = {
    url: 'url'
};

exports.store = {
    models: {
        startProgress: { url: '../course-study/course-front/start-progress' },
        download: { url: '../human/file/preview' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            this.models.state.set(payload);
        },
        updateProgress: function(payload) {
            return this.models.state.data.docProgress(payload);
        },
        startProgress: function() {
            var id = this.models.state.data.section.id;
            var model = this.models.startProgress;
            model.set({ id: id });
            model.params = { clientType: 0 };
            return this.get(model);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
