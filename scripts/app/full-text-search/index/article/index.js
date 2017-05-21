exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        articles: {
            url: '../ask-bar/question/queryArticle',
            type: 'pageable',
            pageSize: 40,
            root: 'items'
        },
        down: { url: '../human/file/download' },
        state: {}
    },
    callbacks: {
        init: function(options) {
            var articles = this.models.articles;
            this.models.state.set(options.state);
            articles.params = {
                name: options.state.searchContent,
                topicId: options.state.topicId
            };
            return this.get(articles, { slient: true });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
