exports.routes = {
    index: 'showIndex',
    'detail/:id': 'showDetail'
};

exports.showIndex = function() {
    return this.app.show('content', 'course/index');
};

exports.showDetail = function(id) {
    return this.app.show('content', 'course/detail', { id: id });
};
