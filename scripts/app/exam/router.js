exports.routes = {
    index: 'showIndex',
    'answer-paper': 'showPaper',
    'score-detail-paper': 'showScoreDetailPaper',
    'mark-paper': 'showMarkPaper',
    'mark-paper-test': 'showMark2',
    demo: 'showDemo',
    demo: 'showDemo',
    'answer-paper-test': 'showAnswerPaperTest',
    'score-detail-paper-test': 'showScore2',
};

exports.showIndex = function() {
    return this.app.show('content', 'exam/index');
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

exports.showDemo = function() {
    return this.app.show('content', 'exam/demo');
};

exports.showAnswerPaperTest = function() {
    return this.app.show('content', 'exam/answer-paper-test');
};

exports.showScore2 = function() {
    return this.app.show('content', 'exam/score-detail-paper-test');
};
