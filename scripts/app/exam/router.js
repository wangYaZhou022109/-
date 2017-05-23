exports.routes = {
    'index/:id': 'showIndex',
    'exam/paper/:id': 'showPaper',
    'exam/index/:id': 'showExamIndex',
    'exam/answer-paper/:id': 'showAnswerPaper',
    'exam/mark-paper/:id': 'showMarkPaper',
    'exam/score-detail/:id': 'showScoreDetail',
    'research-activity/research-answer/:id': 'showResearchAnswerDetail',
    'research-activity/research-detail/:id/:businessId': 'showResearchDetail',
    'research-activity/paper/:id/:businessId': 'showResearchPaper',
    'research-activity/index/:id': 'showIndex',
    'research-activity/summary/:id/:businessId': 'showResearchSummary'
};

exports.showIndex = function(id) {
    return this.app.show('content', 'exam/index', { id: id });
};

exports.showPaper = function(id) {
    return this.app.viewport.showIt('content', 'exam/exam/paper', { examId: id });
};

exports.showExamIndex = function(id) {
    return this.app.viewport.showIt('content', 'exam/exam/index', { examId: id });
};

exports.showMarkPaper = function(id) {
    return this.app.viewport.showIt('content', 'exam/exam/mark-paper', { examRecordId: id });
};

exports.showAnswerPaper = function(id) {
    return this.app.viewport.showIt('content', 'exam/exam/answer-paper', { examId: id });
};

exports.showScoreDetail = function(id) {
    return this.app.viewport.showIt('content', 'exam/exam/score-detail', { examRecordId: id });
};

exports.showResearchDetail = function(id, businessId) {
    return this.app.viewport.showIt('content', 'exam/research-activity/research-detail', {
        researchQuestionaryId: id,
        businessId: businessId
    });
};

exports.showResearchAnswerDetail = function(id) {
    return this.app.viewport.showIt('content', 'exam/research-activity/research-answer', {
        researchRecordId: id
    });
};

exports.showResearchPaper = function(id, businessId) {
    return this.app.viewport.showIt('content', 'exam/research-activity/paper', {
        researchId: id,
        businessId: businessId
    });
};

exports.showIndex = function(id) {
    return this.app.show('content', 'exam/research-activity/index', { researchId: id });
};

exports.showResearchSummary = function(id, businessId) {
    return this.app.viewport.showIt('content', 'exam/research-activity/summary', {
        researchQuestionaryId: id,
        businessId: businessId
    });
};
