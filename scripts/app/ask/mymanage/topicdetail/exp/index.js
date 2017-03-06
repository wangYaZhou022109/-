
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/exp-sharing' },
        setEssenceStatus: { url: '../ask-bar/question/essence-status' },
        shut: { url: '../ask-bar/question/close-status' },
        discuss: { url: '../ask-bar/question-discuss' }
    },
    callbacks: {
        init: function(payload) {
            var trends = this.models.trends;
            trends.set({ id: payload.state.data.topicid });
            return this.get(trends);
        },
        setEssenceStatus: function(payload) {
            this.models.setEssenceStatus.set(payload);
            return this.put(this.models.setEssenceStatus);
        },
        shut: function(payload) {
            this.models.shut.set(payload);
            return this.put(this.models.shut);
        },
        discusstop: function(payload) {
            var discusstop = this.models.discuss;
            var data = payload;
            data.topsStatus = 1;
            discusstop.set(data);
            return this.post(discusstop);
        }
    }
};

exports.afterRender = function() {
    // console.log('1111111111111');
    var data = this.renderOptions.state.data;
    console.log(data.topicid);
    if (typeof data.topicid !== 'undefined') {
        return this.dispatch('init', this.renderOptions);
    }
    return null;
};
