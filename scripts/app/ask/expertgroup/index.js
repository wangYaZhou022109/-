
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
        topicType: { url: '../system/topic-type' }
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
        }
    }
};

exports.afterRender = function() {
    this.dispatch('topicType', this.renderOptions);
    this.dispatch('init', this.renderOptions);
    this.dispatch('user');
};
