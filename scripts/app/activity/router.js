
exports.routes = {
    index: 'showIndex',
    'gensee/detail/:id': 'showLiveDetails',
    'class-details': 'showClassDetails',
    'class-register': 'showClassRegister',
    'classmate-book': 'showClassmatebook'
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

exports.showClassRegister = function() {
    return this.app.show('content', 'activity/class-register');
};

exports.showClassmatebook = function() {
    return this.app.show('content', 'activity/classmate-book');
};

