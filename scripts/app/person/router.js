exports.routes = {
    archives: 'showArchives',
    lecture: 'showLecture',
    index: 'showIndex',
    course: 'showCourse',
    subject: 'showSubject',
    knowledge: 'showKnowledge',
    post: 'showPost',
    ask: 'showAsk'
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

exports.showSubject = function() {
    return this.app.show('content', 'person/subject');
};

exports.showKnowledge = function() {
    return this.app.show('content', 'person/knowledge');
};

exports.showPost = function() {
    return this.app.show('content', 'person/post');
};

exports.showAsk = function() {
    return this.app.show('content', 'person/ask');
};
