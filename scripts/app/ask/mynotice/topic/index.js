
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        topic: { url: '../ask-bar/trends/focus-topic' },
        topicType: { url: '../system/topic-type' },
        unfollow: { url: '../ask-bar/concern/unfollow' }
    },
    callbacks: {
        init: function() {
            var topic = this.models.topic;
            topic.set({ id: 'all' });
            return this.get(topic);
        },
        topicType: function() {
            var topicType = this.models.topicType;
            return this.get(topicType);
        },
        check: function(payload) {
            var topic = this.models.topic;
            topic.set(payload);
            return this.get(topic);
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
