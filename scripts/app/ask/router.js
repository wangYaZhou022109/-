exports.routes = {
    index: 'showIndex',
    'indexmenu/:id': 'showMnue',
    'topicdetail/:id': 'showTopicDetails',
    'noticertopicdetail/:id': 'showNoticerTopicDetails',
    'expert/index': 'showExpertIndex',
    topicsquare: 'showtopicsquare',
    'topic/index': 'showTopic',
    'expertdetails/:id': 'showExpertDetail',
    'noticerexpertdetails/:id': 'showNoticerExpertDetail',
    iamexpertdetails: 'showIamExpertDetails',
    'questiondetails/:id': 'showQuestionDetails',
    'noticerquestiondetails/:id': 'showNoticerQuestionDetails',
    'articledetails/:id': 'showArticleDetails',
    'noticerarticledetails/:id': 'showNoticerArticleDetails'
};

exports.showIndex = function() {
    return this.app.show('content', 'ask/index');
};
exports.showMnue = function(id) {
    var url = '';
    if (typeof id === 'undefined') {
        url = 'index';
    } else {
        url = 'content/' + id;
    }
    return this.app.show('content', 'ask/' + url, { id: id });
};
exports.showTopic = function() {
    return this.app.show('content', 'ask/topic');
};
exports.showTopicDetails = function(id) {
    return this.app.show('content', 'ask/mymanage/topicdetail', { id: id });
};
exports.showNoticerTopicDetails = function(id) {
    this.app.viewport.closeModal();
    return this.app.show('content', 'ask/mymanage/topicdetail', { id: id });
};
exports.showExpertDetail = function(id) {
    return this.app.show('content', 'ask/expertdetails', { id: id });
};
exports.showNoticerExpertDetail = function(id) {
    this.app.viewport.closeModal();
    return this.app.show('content', 'ask/expertdetails', { id: id });
};
exports.showIamExpertDetails = function() {
    return this.app.show('content', 'ask/iamexpert');
};
exports.showExpertIndex = function() {
    return this.app.show('content', 'ask/expert');
};
exports.showtopicsquare = function(id) {
    return this.app.show('content', 'ask/topicsquare', { id: id });
};

exports.showQuestionDetails = function(id) {
    return this.app.show('content', 'ask/myquiz/details', { id: id });
};
exports.showNoticerQuestionDetails = function(id) {
    this.app.viewport.closeModal();
    return this.app.show('content', 'ask/myquiz/details', { id: id });
};
exports.showArticleDetails = function(id) {
    return this.app.show('content', 'ask/myshares/details', { id: id });
};
exports.showNoticerArticleDetails = function(id) {
    this.app.viewport.closeModal();
    return this.app.show('content', 'ask/myshares/details', { id: id });
};
