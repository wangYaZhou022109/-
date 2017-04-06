
exports.items = {
    list: 'list',
    'ask/report': { isModule: true }
};

exports.store = {
    models: {
        trends: { url: '../ask-bar/trends/news' },
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' }
    },
    callbacks: {
        init: function(payload) {
            var trends = this.models.trends;
            trends.set({ id: payload.state.data.topicid });
            return this.get(trends);
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
