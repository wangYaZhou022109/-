exports.routes = {
    'index/:id': 'showIndex',
    response: 'showResponse',
    'sign-detail': 'showSignDetail'
};

exports.showIndex = function(id) {
    return this.app.show('content', 'train/index', { id: id });
};

exports.showResponse = function() {
    return this.app.show('content', 'train/response');
};

exports.showSignDetail = function(id) {
    return this.app.show('content', 'train/service/sign/sign-detail', { id: id });
};
