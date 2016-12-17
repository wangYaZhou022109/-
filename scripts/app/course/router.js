exports.routes = {
    index: 'showIndex',
    detail: 'showDetail'
};

exports.showIndex = function() {
    return this.app.show('content', 'course/index');
};

exports.showDetail = function() {
    return this.app.show('content', 'course/detail');
};
