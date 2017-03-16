exports.routes = {
    index: 'showIndex',
    'details/:id': 'showDetails'
};

exports.showIndex = function() {
    return this.app.show('content', 'knowledge/index');
};

exports.showDetails = function(id) {
    return this.app.show('content', 'knowledge/details', { id: id });
};
