exports.routes = {
    'index/:id': 'showIndex',
    'detail/:id/:type': 'showDetail',
    'preview/:config': 'showPreview'
};

exports.showIndex = function(id) {
    return this.app.show('content', 'news/index', { id: id });
};

exports.showDetail = function(id, type) {
    return this.app.show('content', 'news/detail', { id: id, type: type });
};

exports.showPreview = function(config) {
    return this.app.show('content', 'news/preview', { news: config });
};
