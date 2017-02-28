exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        topic: { url: '../ask-bar/topic/hot-topic' }
    },
    callbacks: {
        init: function() {
            var topic = this.models.topic;
            topic.set({ id: 1222 });
            return this.get(topic);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
