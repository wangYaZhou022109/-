exports.routes = {
    index: 'showIndex',
    'detail/:id': 'showDetail'
};

exports.showIndex = function() {
    return this.app.show('content', 'study-subject/index');
};

exports.showDetail = function(id) {
    return this.app.show('content', 'study-subject/detail', { id: id });
};
