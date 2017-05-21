exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        topics: {
            url: '../ask-bar/topic/queryTopic',
            type: 'pageable',
            pageSize: 40,
            root: 'items'
        },
        down: { url: '../human/file/download' },
        state: {}
    },
    callbacks: {
        init: function(options) {
            var topics = this.models.topics;
            this.models.state.set(options.state);
            topics.params = {
                name: options.state.searchContent,
                topicId: options.state.topicId
            };
            return this.get(topics, { slient: true });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
