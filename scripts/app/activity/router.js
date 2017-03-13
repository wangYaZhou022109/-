
exports.routes = {
    index: 'showIndex',
    'gensee/detail/:id': 'showLiveDetails',
    'class-details': 'showClassDetails'
};

exports.showIndex = function() {
    return this.app.show('content', 'activity/index');
};

exports.showLiveDetails = function(targetId) {
    return this.app.show('content', 'activity/live-details', { genseeId: targetId });
};

exports.showClassDetails = function() {
    return this.app.show('content', 'activity/class-details');
};

