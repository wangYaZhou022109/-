var D = require('drizzlejs');

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
                getDuration = function(endTime, startTime) {
                    var duration = (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60);
                    return duration.toFixed(2);
                },
                minute;

            if (payload.data.isDelay) {
                this.app.message.success('您被延时了');
            }

            if (payload.data.endTime
                && payload.data.endTime > new Date(payload.data.startTime).getTime()) {
                minute = getDuration(payload.data.endTime, payload.data.startTime);
                state.data = { duration: minute };
            } else {
                state.set({ duration: 0 });
            }
            state.callback = payload.callback;
        },
        setInterval: function(payload) {
            D.assign(this.models.state.data, payload);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.mixin = {
    clearIntervalIt: function() {
        var si = this.store.models.state.data.si;
        clearInterval(si);
    }
};

