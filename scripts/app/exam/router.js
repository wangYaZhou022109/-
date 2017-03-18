var $ = require('jquery');

exports.routes = {
    'index/:id': 'showIndex',
    'exam/answer-paper/:id': 'showAnswerPaper',
    'exam/mark-paper/:id': 'showMarkPaper',
    'exam/score-detail/:id': 'showScoreDetail',
    'research-activity/research-answer-detail/:id': 'showResearchAnswerDetail',
    'research-activity/research-summary-detail/:id': 'showResearchSummaryDetail',
    'research-activity/research-detail/:id': 'showResearchDetail'
};

exports.showIndex = function(id) {
    return this.app.show('content', 'exam/index', { id: id });
};

exports.showMarkPaper = function(fir, id) {
    return this.app.show('content', 'exam/exam/mark-paper', { examRecordId: id });
};

exports.showAnswerPaper = function(fir, id) {
    return this.app.show('content', 'exam/exam/answer-paper', { examId: id });
};

exports.showScoreDetail = function(fir, id) {
    return this.app.show('content', 'exam/exam/score-detail', { examId: id });
};

exports.showResearchDetail = function(fir, id) {
    return this.app.show('content', 'exam/research-activity/research-detail', { researchQuestionaryId: id });
};

exports.showResearchAnswerDetail = function(fir, id) {
    return this.app.show('content', 'exam/research-activity/research-answer-detail', { researchRecordId: id });
};

exports.showResearchSummaryDetail = function(fir, id) {
    return this.app.show('content', 'exam/research-activity/research-summary-detail', { researchRecordId: id });
};

exports.interceptors = {
    'exam/answer-paper': 'clearHeadAndBottom',
    'exam/mark-paper': 'clearHeadAndBottom',
    'exam/score-detail': 'clearHeadAndBottom',
    'research-activity/research-detail': 'clearHeadAndBottom',
    'research-activity/research-answer-detail': 'clearHeadAndBottom',
    'research-activity/research-summary-detail': 'clearHeadAndBottom'
};

exports.clearHeadAndBottom = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
