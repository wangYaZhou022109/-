exports.routes = {
    index: 'showIndex',
    'answer-paper': 'showPaper'
};

exports.showIndex = function() {
    return this.app.show('content', 'exam/index');
};
exports.showPaper = function() {
    return this.app.show('content', 'exam/answer-paper');
};
