exports.routes = {
    index: 'showIndex',
    'detail/:id/:type': 'showDetail',
    'preview/:config': 'showPreview'
};

exports.showIndex = function() {
    return this.app.show('content', 'news/index');
};

exports.showDetail = function(id, type) {
    return this.app.show('content', 'news/detail', { id: id, type: type });
};

exports.showPreview = function(config) {
    return this.app.show('content', 'news/preview', { news: config });
};
