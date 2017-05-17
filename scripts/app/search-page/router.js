exports.routes = {
    index: 'showIndex',
    details: 'showDetails'
};

exports.showIndex = function() {
    return this.app.show('content', 'search-page/index');
};

exports.showDetails = function() {
    return this.app.show('content', 'search-page/details');
};
