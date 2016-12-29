
exports.routes = {
    'index/:id': 'showIndex',
    'answer-paper-test/:id': 'showAnswerPaperTest',
    'answer-paper': 'showPaper',
    'score-detail-paper': 'showScoreDetailPaper',
    'mark-paper': 'showMarkPaper',
    'mark-paper-test': 'showMark2',
    demo: 'showDemo',
    'score-detail-paper-test': 'showScore2'
};

exports.showIndex = function(id) {
    return this.app.show('content', 'exam/index', { id: id });
};
exports.showPaper = function() {
    return this.app.show('content', 'exam/answer-paper');
};
exports.showScoreDetailPaper = function() {
    return this.app.show('content', 'exam/score-detail-paper');
};
exports.showMarkPaper = function() {
    return this.app.show('content', 'exam/mark-paper');
};
exports.showMark2 = function() {
    return this.app.show('content', 'exam/mark-paper-test');
};

exports.showAnswerPaperTest = function(id) {
    return this.app.show('content', 'exam/answer-paper-test', { examId: id });
};

exports.showScore2 = function() {
    return this.app.show('content', 'exam/score-detail-paper-test');
};
