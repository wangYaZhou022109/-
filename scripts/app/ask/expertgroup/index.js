
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
            var follow = this.models.follow,
                me = this,
                expert = this.models.expert;
            follow.set(payload);
            expert.set({ id: this.models.expert.data.id, concernType: '1' });
            return this.post(follow).then(function() {
                me.app.message.success('关注成功');
                me.get(expert);
            });
        },
        unfollow: function(payload) {
            var unfollow = this.models.unfollow,
                me = this,
                expert = this.models.expert;
            expert.set({ id: this.models.expert.data.id, concernType: '1' });
            unfollow.set({ id: payload.id, concernType: '1' });
            return this.put(unfollow).then(function() {
                me.app.message.success('取消成功');
                me.get(expert);
            });
        }
    }
};

exports.afterRender = function() {
    this.dispatch('topicType', this.renderOptions);
    this.dispatch('init', this.renderOptions);
    this.dispatch('user');
};
