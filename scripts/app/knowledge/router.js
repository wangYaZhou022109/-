exports.routes = {
    index: 'showIndex',
    details: 'showDetails'
};

exports.showIndex = function() {
    return this.app.show('content', 'knowledge/index');
};

exports.showDetails = function() {
    return this.app.show('content', 'knowledge/details');
};
