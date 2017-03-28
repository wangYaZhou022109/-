var $ = require('jquery');

exports.routes = {
    'index/:id': 'showIndex',
    'exam/paper/:id': 'showPaper',
    'exam/answer-paper/:id': 'showAnswerPaper',
    'exam/mark-paper/:id': 'showMarkPaper',
    'exam/score-detail/:id': 'showScoreDetail',
    'research-activity/research-answer/:id': 'showResearchAnswerDetail',
    'research-activity/research-detail/:id': 'showResearchDetail',
    'research-activity/index/:id': 'showIndex',
    'research-activity/paper/:id': 'showResearchPaper'
};

exports.showIndex = function(id) {
    return this.app.show('content', 'exam/index', { id: id });
};

exports.showPaper = function(fir, id) {
    return this.app.show('content', 'exam/exam/paper', { examId: id });
};

exports.showMarkPaper = function(fir, id) {
    return this.app.show('content', 'exam/exam/mark-paper', { examRecordId: id });
};

exports.showAnswerPaper = function(fir, id) {
    return this.app.show('content', 'exam/exam/answer-paper', { examId: id });
};

exports.showScoreDetail = function(fir, id) {
    return this.app.show('content', 'exam/exam/score-detail', { examRecordId: id });
};

exports.showResearchDetail = function(fir, id) {
    return this.app.show('content', 'exam/research-activity/research-detail', { researchQuestionaryId: id });
};

exports.showResearchAnswerDetail = function(fir, id) {
    return this.app.show('content', 'exam/research-activity/research-answer', { researchRecordId: id });
};

exports.showResearchPaper = function(fir, id) {
    return this.app.show('content', 'exam/research-activity/paper', { researchId: id });
};

exports.showIndex = function(id) {
    return this.app.show('content', 'exam/research-activity/index', { researchId: id });
};

exports.interceptors = {
    'exam/paper': 'clearHeadAndBottom',
    'exam/answer-paper': 'clearHeadAndBottom',
    'exam/mark-paper': 'clearHeadAndBottom',
    'exam/score-detail': 'clearHeadAndBottom',
    'research-activity/research-detail': 'clearHeadAndBottom',
    'research-activity/research-answer': 'clearHeadAndBottom',
    'research-activity/paper/': 'clearHeadAndBottom'
};

exports.clearHeadAndBottom = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
