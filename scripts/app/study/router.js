exports.routes = {
    'course/index': 'showCourseIndex',
    'subject/index': 'showSubjectIndex',
    'course/detail/:id': 'showCourseDetail',
    'subject/detail/:id': 'showSubjectDetail',
    'subject/preview/:config': 'showPreview',
    'task/:id': 'showTask',
    'subject/detail/new-template1': 'showSubjectNewDetail',
    'task/audit/:id': 'showTaskAudit'
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
    var subjectId = id;
    if (subjectId.indexOf('&') > -1) {
        subjectId = subjectId.split('&')[0];
    }
    return this.app.show('content', 'study/subject/detail', { id: subjectId });
};

exports.showPreview = function(config) {
    return this.app.show('content', 'study/subject/preview', { config: config });
};

exports.showTask = function(id) {
    return this.app.viewport.showIt('content', 'study/task', { id: id });
};

exports.showSubjectNewDetail = function() {
    return this.app.show('content', 'study/subject/detail/new-template1');
};

exports.showTaskAudit = function(id) {
    return this.app.viewport.showIt('content', 'study/task/audit', { id: id });
};
