
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        topic: { url: '../ask-bar/trends/focus-topic' },
        topicType: { url: '../system/topic-type' }
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
        }
    }
};

exports.afterRender = function() {
    this.dispatch('topicType');
    this.dispatch('init');
};
