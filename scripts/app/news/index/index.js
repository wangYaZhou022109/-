exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        newsPages: {
            url: '../system/home-news/homePages',
            root: 'items',
            pageSize: 5,
            type: 'pageable'
        }
    },
    callbacks: {
        init: function(payload) {
            var newsPages = this.models.newsPages;
            newsPages.clear();
            newsPages.params.moduleHomeConfigId = payload.id;
            return this.get(newsPages);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};
