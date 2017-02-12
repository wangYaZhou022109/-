exports.routes = {
    'index/:id': 'showIndex'
};

exports.showIndex = function(id) {
    return this.app.show('content', 'train/index', { id: id });
};
