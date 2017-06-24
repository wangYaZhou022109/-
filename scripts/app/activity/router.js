
exports.routes = {
    index: 'showIndex',
    'gensee/detail/:id': 'showLiveDetails',
    'gensee/preview/:id': 'showLivePreview',
    'class-details': 'showClassDetails',
    'class-register': 'showClassRegister',
    'classmate-book': 'showClassmatebook',
    'class-details/lengthranking': 'showLengthranking'
};

exports.showIndex = function() {
    return this.app.show('content', 'activity/index');
};

exports.showLiveDetails = function(targetId) {
    return this.app.show('content', 'activity/live-details', { genseeId: targetId });
};

exports.showLivePreview = function(targetId) {
    return this.app.show('content', 'activity/live-preview', { genseeId: targetId });
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

exports.showLengthranking = function() {
    return this.app.show('content', 'activity/class-details/lengthranking');
};
