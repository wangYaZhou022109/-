exports.routes = {
    index: 'showIndex',
    'detail/:id': 'showDetail',
    'preview/:config': 'showPreview'
};

exports.showIndex = function() {
    return this.app.show('content', 'study-subject/index');
};

exports.showDetail = function(id) {
    return this.app.show('content', 'study-subject/detail', { id: id });
};

exports.showPreview = function(config) {
    return this.app.show('content', 'study-subject/preview', { config: config });
};
