exports.routes = {
    index: 'showIndex',
    'live-details': 'showLiveDetails',
    'class-details': 'showClassDetails'
};

exports.showIndex = function() {
    return this.app.show('content', 'activity/index');
};

exports.showLiveDetails = function() {
    return this.app.show('content', 'activity/live-details');
};

exports.showClassDetails = function() {
    return this.app.show('content', 'activity/class-details');
};
