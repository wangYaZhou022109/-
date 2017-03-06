exports.routes = {
    archives: 'showArchives',
    lecture: 'showLecture',
    index: 'showIndex',
    course: 'showCourse',
    subject: 'showSubject',
    knowledge: 'showKnowledge',
    post: 'showPost',
    ask: 'showAsk',
    mooc: 'showMooc',
    live: 'showLive',
    exam: 'showExam',
    class: 'showClass',
    train: 'showTrain',
    follow: 'showFollow',
    favorite: 'showFavorite'
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

exports.showMooc = function() {
    return this.app.show('content', 'person/mooc');
};

exports.showLive = function() {
    return this.app.show('content', 'person/live');
};

exports.showExam = function() {
    return this.app.show('content', 'person/exam');
};

exports.showClass = function() {
    return this.app.show('content', 'person/class');
};

exports.showTrain = function() {
    return this.app.show('content', 'person/train');
};

exports.showFollow = function() {
    return this.app.show('content', 'person/follow');
};

exports.showFavorite = function() {
    return this.app.show('content', 'person/favorite');
};
