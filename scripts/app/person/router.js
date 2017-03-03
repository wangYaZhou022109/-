exports.routes = {
    archives: 'showArchives',
    lecture: 'showLecture',
    index: 'showIndex'
};

exports.showArchives = function() {
    return this.app.show('content', 'person/archives');
};

exports.showLecture = function() {
    return this.app.show('content', 'person/lecture');
};

exports.showIndex = function() {
    return this.app.show('content', 'person/index');
};
