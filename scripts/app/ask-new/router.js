exports.routes = {
    index: 'showIndex',
};

exports.showIndex = function() {
    return this.app.show('content', 'ask-new/index');
};
