var _ = require('lodash/collection');
exports.items = {
    details: 'details'
};

exports.store = {
    models: {
        state: { data: [] },
        topicname: {
            url: '../ask-bar/topic/topic-name',
            mixin: {
                getTopic: function(id) {
                    var data = {};
                    _.forEach(this.data, function(d) {
                        if (d.id === id) {
                            data = d;
                        }
                    });
                    return data;
                }
            }
        },
        innerExpert: { url: '../ask-bar/expert/insert-inner' }
    },
    callbacks: {
        init: function() {
            var topicname = this.models.topicname;
            return this.get(topicname);
        },
        saveInner: function(payload) {
            var innerExpert = this.models.innerExpert;
            innerExpert.clear();
            innerExpert.set(payload);
            return this.save(innerExpert);
        },
        getExpert: function() {
        },
        delTopic: function(payload) {
            var state = this.models.state;
            var newState = [];
            var data = payload;
            _.forEach(state.data, function(d) {
                if (d.id !== data.id) {
                    newState.push(d);
                }
            });
            state.data = newState;
            state.changed();
        },
        addTopic: function(payload) {
            var data = this.models.topicname.getTopic(payload.id);
            var state = this.models.state,
                falg = true;
            _.forEach(state.data, function(d) {
                if (d.id === data.id) {
                    falg = false;
                }
            });
            if (typeof data === 'object' && falg) {
                state.data.push(data);
                state.changed();
            }
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init');
    this.dispatch('getExpert');
};

exports.title = '专家申请';

exports.buttons = [{
    text: '提交申请'
}];
