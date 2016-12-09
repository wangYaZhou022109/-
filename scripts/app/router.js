exports.routes = {
    home: 'showHome',
    'course/index': 'showCourse',
    'activity/index': 'showActive'
};

exports.showHome = function() {
    return this.app.show('content', 'home/default');
};

exports.showCourse = function() {
    return this.app.show('content', 'course/index');
};

exports.showActive = function() {
    return this.app.show('content', 'activity/index');
};
