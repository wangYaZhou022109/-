exports.items = {
    video: 'video'
};

exports.store = {
    models: {
        download: { url: '../human/file/download' },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state;
            state.set(payload);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.state);
};
