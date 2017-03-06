exports.routes = {
    index: 'showIndex',
    archives: 'showArchives'
};

exports.showIndex = function() {
    return this.app.show('content', 'center/index');
};

exports.showArchives = function() {
    return this.app.show('content', 'center/archives');
};
