exports.routes = {
    archives: 'showArchives',
    lecture: 'showLecture',
    index: 'showIndex',
    course: 'showCourse'
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

exports.showCourse = function() {
    return this.app.show('content', 'person/course');
};
