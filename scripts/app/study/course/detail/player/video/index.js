exports.items = {
    video: 'video'
};

exports.store = {
    models: {
        startProgress: { url: '../course-study/course-front/start-progress' },
        duration: { url: '../course-study/course-front/update-media-time' },
        attachment: { url: '../human/file' },
        download: { url: '../human/file/download' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                attachment = this.models.attachment;
            state.set(payload);
            attachment.set({ id: payload.section.resourceId });
            return this.get(attachment);
        },
        updateProgress: function(payload) {
            return this.models.state.data.mediaProgress(payload);
        },
        duration: function(payload) {
            var id = this.models.state.data.section.id;
            var model = this.models.duration;
            model.set({ sectionId: id, duration: payload.duration });
            return this.post(model);
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
    return this.dispatch('init', this.renderOptions);
};
