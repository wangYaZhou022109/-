
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
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
        },
        follow: function(payload) {
            var follow = this.models.follow;
            follow.set(payload);
            return this.post(follow);
        },
        unfollow: function(payload) {
            var follow = this.models.unfollow;
            // console.log(payload);
            follow.set(payload);
            return this.put(follow);
        },
        publish: function(payload) {
            var discuss = this.models.discuss;
            discuss.set(payload);
            return this.save(discuss);
        }
    }
};

exports.afterRender = function() {
    var data = this.renderOptions.state.data;
    if (typeof data.topicid !== 'undefined') {
        return this.dispatch('init', this.renderOptions);
    }
    return null;
};
