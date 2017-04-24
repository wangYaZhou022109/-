
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        experts: { url: '../ask-bar/trends/focus-experts' },
        topicType: { url: '../system/topic-type' },
        unfollow: { url: '../ask-bar/concern/unfollow' }
    },
    callbacks: {
        init: function() {
            var experts = this.models.experts;
            experts.set({ id: 'all' });
            return this.get(experts);
        },
        topicType: function() {
            var topicType = this.models.topicType;
            return this.get(topicType);
        },
        check: function(payload) {
            var experts = this.models.experts;
            experts.set(payload);
            return this.get(experts);
        },
        unfollow: function(payload) {
            var unfollow = this.models.unfollow,
                me = this;
            unfollow.set(payload);
            return this.put(unfollow).then(function() {
                me.app.message.success('取消成功');
                me.module.dispatch('init');
            });
        }
    }
};

exports.afterRender = function() {
    this.dispatch('topicType');
    this.dispatch('init');
};
