exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        askBar: {
            url: '../ask-bar/question/queryQuestion',
            type: 'pageable',
            pageSize: 40,
            root: 'items'
        },
        down: { url: '../human/file/download' },
        state: {}
    },
    callbacks: {
        init: function(options) {
            var askBar = this.models.askBar;
            this.models.state.set(options.state);
            askBar.params = {
                name: options.state.searchContent,
                topicId: options.state.topicId
            };
            return this.get(askBar, { slient: true });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
