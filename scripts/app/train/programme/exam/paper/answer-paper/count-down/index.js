exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var data = this.models.state.data,
                getDuration = function(endTime) {
                    return Math.floor((new Date(endTime) - new Date()) / (1000 * 60));
                };
            data.duration = getDuration(payload.data.endTime);
            data.duration = 60;
            this.models.state.callback = payload.callback;
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
