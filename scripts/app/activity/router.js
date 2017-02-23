exports.routes = {
    index: 'showIndex',
    'live-details': 'showLiveDetails'
};

exports.showIndex = function() {
    return this.app.show('content', 'activity/index');
};

exports.showLiveDetails = function() {
    return this.app.show('content', 'activity/live-details');
};
