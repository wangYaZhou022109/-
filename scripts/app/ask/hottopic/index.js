exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        topic: { url: '../ask-bar/topic/hot-topic' },
        down: { url: '../human/file/download' }
    },
    callbacks: {
        init: function() {
            var topic = this.models.topic;
            topic.set({ id: 'undefined', size: 3 });
            return this.post(topic);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
