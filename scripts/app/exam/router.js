
exports.routes = {
    'index/:id': 'showIndex',
    'answer-paper/:id': 'showAnswerPaper',
    'answer-paper-2/:id': 'showAnswerPaper2',
    'mark-paper': 'showMarkPaper',
    'mark-paper-test': 'showMark2',
    demo: 'showDemo',
    'score-detail-paper-test/:id': 'showScore'
};

exports.showIndex = function(id) {
    return this.app.show('content', 'exam/index', { id: id });
};
exports.showMarkPaper = function() {
    return this.app.show('content', 'exam/mark-paper');
};
exports.showMark2 = function() {
    return this.app.show('content', 'exam/mark-paper-test');
};

exports.showAnswerPaper = function(id) {
    return this.app.show('content', 'exam/answer-paper', { examId: id });
};
exports.showAnswerPaper2 = function(id) {
    return this.app.show('content', 'exam/answer-paper-2', { examId: id });
};

exports.showScore = function(id) {
    return this.app.show('content', 'exam/score-detail-paper-test', { examRecordId: id });
};
