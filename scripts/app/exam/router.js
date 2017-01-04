
exports.routes = {
    'index/:id': 'showIndex',
    'answer-paper/:id': 'showAnswerPaperTest',
    'score-detail-paper': 'showScoreDetailPaper',
    'mark-paper': 'showMarkPaper',
    'mark-paper-test': 'showMark2',
    demo: 'showDemo',
    'score-detail-paper-test/:id': 'showScore2'
};

exports.showIndex = function(id) {
    return this.app.show('content', 'exam/index', { id: id });
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
    return this.app.show('content', 'exam/answer-paper', { examId: id });
};

exports.showScore2 = function(id) {
    return this.app.show('content', 'exam/score-detail-paper-test', { examRecordId: id });
};
