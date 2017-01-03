exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                getDuration = function(endTime) {
                    var duration = (new Date(endTime).getTime() - new Date().getTime()) / (1000 * 60);
                    return duration.toFixed(2);
                },
                minute;

            if (payload.data.isDelay) {
                this.app.message.success('您被延时了');
            }

            if (payload.data.endTime && payload.data.endTime > new Date().getTime()) {
                minute = getDuration(payload.data.endTime);
                state.data = { duration: minute };
                state.callback = payload.callback;
            } else {
                state.set({ duration: 0 });
            }
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
