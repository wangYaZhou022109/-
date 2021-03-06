var D = require('drizzlejs');

exports.items = {
    main: 'main',
    tips: ''
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
                D.assign(state.data, {
                    isDelay: payload.data.isDelay,
                    delay: payload.data.delay
                });
            }

            if (payload.data.endTime
                && payload.data.endTime > new Date(payload.data.startTime).getTime()) {
                minute = getDuration(payload.data.endTime, payload.data.startTime);
                D.assign(state.data, { duration: minute });
            } else {
                D.assign(state.data, { duration: 0 });
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

exports.afterRender = function() {
    var state = this.store.models.state.data,
        me = this;
    if (state.isDelay) {
        return this.app.viewport.modal(this.items.tips, {
            tips: '您被延时了' + state.delay + '分钟'
        }).then(function() {
            if (me.renderOptions.resetDelay) {
                me.renderOptions.resetDelay();
            }
        });
    }
    return '';
};

exports.mixin = {
    clearIntervalIt: function() {
        var si = this.store.models.state.data.si;
        clearInterval(si);
    }
};

