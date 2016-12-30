exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: {
            type: 'localStorage'
        }
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                getDuration = function(endTime) {
                    return Math.ceil((new Date(endTime).getTime() - new Date().getTime()) / (1000 * 60));
                },
                minute;
            state.clear();
            if (payload.data.isDelay) {
                this.app.message.success('您被延时了');
            }

            state.load();
            if (!state.data) {
                if (payload.data.endTime && payload.data.endTime > new Date().getTime()) {
                    minute = getDuration(payload.data.endTime);
                    this.models.state.data = {
                        duration: minute,
                        second: minute * 60
                    };
                    this.models.state.callback = payload.callback;
                } else {
                    this.models.state.set({ duration: 0 });
                }
            }
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
