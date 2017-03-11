var $ = require('jquery');

exports.routes = {
    'index/:id': 'showIndex',
    'exam/answer-paper/:id': 'showAnswerPaper',
    'exam/answer-paper-2/:id': 'showAnswerPaper2',
    'exam/mark-paper': 'showMarkPaper',
    'exam/mark-paper-test': 'showMark2',
    'exam/score-detail-paper-test/:id': 'showScore',
    'research-activity/research-detail/:id': 'showResearchDetail'
};

exports.interceptors = {
    'exam/answer-paper-2': 'clearHeadAndBottom',
    'research-activity/research-detail': 'clearHeadAndBottom',
};

exports.showIndex = function(id) {
    return this.app.show('content', 'exam/index', { id: id });
};

exports.showMarkPaper = function() {
    return this.app.show('content', 'exam/exam/mark-paper');
};

exports.showMark2 = function() {
    return this.app.show('content', 'exam/exam/mark-paper-test');
};

exports.showAnswerPaper = function(id) {
    return this.app.show('content', 'exam/exam/answer-paper', { examId: id });
};

exports.showAnswerPaper2 = function(i, id) {
    return this.app.show('content', 'exam/exam/answer-paper-2', { examId: id });
};

exports.showScore = function(id) {
    return this.app.show('content', 'exam/exam/score-detail-paper-test', { examRecordId: id });
};

exports.showResearchDetail = function(i, id) {
    return this.app.show('content', 'exam/research-activity/research-detail', { researchQuestionaryId: id });
};

exports.clearHeadAndBottom = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
