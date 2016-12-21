exports.routes = {
    index: 'showIndex',
    detail: 'showDetail'
};

exports.showIndex = function() {
    return this.app.show('content', 'study-subject/index');
};

exports.showDetail = function() {
    return this.app.show('content', 'study-subject/detail');
};
