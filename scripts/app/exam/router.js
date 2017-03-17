var $ = require('jquery');

exports.routes = {
    'index/:id': 'showIndex',
    'exam/answer-paper/:id': 'showAnswerPaper',
    'exam/mark-paper/:id': 'showMarkPaper',
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

exports.showResearchDetail = function(fir, id) {
    return this.app.show('content', 'exam/research-activity/research-detail', { researchQuestionaryId: id });
};

exports.interceptors = {
    'exam/answer-paper': 'clearHeadAndBottom',
    'exam/mark-paper': 'clearHeadAndBottom',
    'research-activity/research-detail': 'clearHeadAndBottom',
};

exports.clearHeadAndBottom = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
