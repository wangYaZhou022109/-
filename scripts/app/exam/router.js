exports.routes = {
    index: 'showIndex',
    'answer-paper': 'showPaper',
    'score-detail-paper': 'showScoreDetailPaper',
    'mark-paper': 'showMarkPaper',
    demo: 'showDemo',
    'answer-paper-test': 'showAnswerPaperTest'
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

exports.showDemo = function() {
    return this.app.show('content', 'exam/demo');
};

exports.showAnswerPaperTest = function() {
    return this.app.show('content', 'exam/answer-paper-test');
};
