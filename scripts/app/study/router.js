exports.routes = {
    'course/index': 'showCourseIndex',
    'subject/index': 'showSubjectIndex',
    'course/detail/:id': 'showCourseDetail',
    'subject/detail/:id': 'showSubjectDetail',
    'subject/preview/:config': 'showPreview'
};

exports.showCourseIndex = function() {
    return this.app.show('content', 'study/course/index');
};

exports.showCourseDetail = function(id) {
    return this.app.show('content', 'study/course/detail', { id: id });
};

exports.showSubjectIndex = function() {
    return this.app.show('content', 'study/subject/index');
};

exports.showSubjectDetail = function(id) {
    return this.app.show('content', 'study/subject/detail', { id: id });
};

exports.showPreview = function(config) {
    return this.app.show('content', 'study/subject/preview', { config: config });
};
