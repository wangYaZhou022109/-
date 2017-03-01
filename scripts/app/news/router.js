exports.routes = {
    index: 'showIndex',
    detail: 'showDetail'
};

exports.showIndex = function() {
    return this.app.show('content', 'news/index');
};

exports.showDetail = function() {
    return this.app.show('content', 'news/detail');
};
