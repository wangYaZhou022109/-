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
            topic.set({ id: 'undefine', size: 3 });
            // topic.params = { id: 'undefine', size: 3 };
            console.log(topic);
            return this.post(topic);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
