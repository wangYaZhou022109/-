exports.routes = {
    'index/:id': 'showIndex',
    response: 'showResponse',
    'sign-detail': 'showSignDetail',
    'programme/preview/:id': 'showPreview'
};

exports.showIndex = function(id) {
    return this.app.show('content', 'train/index', { id: id });
};

exports.showResponse = function() {
    return this.app.show('content', 'train/response');
};

exports.showPreview = function(id) {
    return this.app.show('content', 'train/programme/preview', { id: id });
};
