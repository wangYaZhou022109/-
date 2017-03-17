exports.routes = {
    index: 'showIndex',
    'my/:name': 'showContent'
};

exports.showIndex = function() {
    return this.app.show('content', 'center/index');
};

exports.showContent = function(name) {
    return this.app.show('content', 'center/index', { name: name });
};
