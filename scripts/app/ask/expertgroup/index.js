
exports.items = {
    list: 'list',
    'ask/expertactivation': { isModule: true },
    'ask/expertapply': { isModule: true },
    'ask/applyexpertaptitude': { isModule: true }
};

exports.store = {
    models: {
        expertlist: { url: '../ask-bar/expert/expert-group' },
        user: { url: '../ask-bar/member/find-expert' },
        topicType: { url: '../system/topic-type' },
        follow: {
            url: '../ask-bar/question-details/boutique'
        },
        down: { url: '../human/file/download' },
        unfollow: { url: '../ask-bar/concern/unfollow' }
    },
    callbacks: {
        init: function() {
            var expert = this.models.expertlist;
            expert.set({ id: 'all' });
            return this.post(expert);
        },
        user: function() {
            var user = this.models.user;
            user.set({ id: 'me' });
            return this.put(user);
        },
        topicType: function() {
            var topicType = this.models.topicType;
            return this.get(topicType);
        },
        check: function(payload) {
            var expert = this.models.expertlist;
            expert.set(payload);
            return this.post(expert);
        },
        follow: function(payload) {
            var follow = this.models.follow;
            follow.set(payload);
            return this.post(follow);
        },
        unfollow: function(payload) {
            var unfollow = this.models.unfollow;
            unfollow.set(payload);
            return this.put(unfollow);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('topicType', this.renderOptions);
    this.dispatch('init', this.renderOptions);
    this.dispatch('user');
};
