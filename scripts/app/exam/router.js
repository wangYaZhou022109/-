var $ = require('jquery'),
    changeToFullScreen;

exports.routes = {
    index: 'showIndex',
    'answer-paper': 'showPaper',
    'score-detail-paper': 'showScoreDetailPaper',
    'mark-paper': 'showMarkPaper',
    'mark-paper-test': 'showMark2',
    demo: 'showDemo',
    'answer-paper-test/:id': 'showAnswerPaperTest',
    'score-detail-paper-test': 'showScore2'
};


exports.interceptors = {
    'answer-paper-test': 'activeAnswerPaperTest'
};

exports.activeAnswerPaperTest = function() {
    changeToFullScreen();
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

exports.showAnswerPaperTest = function(id) {
    return this.app.show('content', 'exam/answer-paper-test', { examId: id });
};

exports.showScore2 = function() {
    return this.app.show('content', 'exam/score-detail-paper-test');
};

changeToFullScreen = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
