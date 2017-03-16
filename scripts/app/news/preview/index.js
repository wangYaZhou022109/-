exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        news: {}
    }
};

exports.beforeRender = function() {
    this.store.models.news.set(JSON.parse(decodeURIComponent(this.renderOptions.news)));
};
