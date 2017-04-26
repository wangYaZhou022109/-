var $ = require('jquery');

exports.routes = {
    'index/:id': 'showIndex',
    'programme/preview/:id': 'showPreview',
    response: 'showResponse',
    classinfos: 'showClassInfos',
    projects: 'showProjects',
    train: 'showTrain',
    'class-detail/task-detail/:id': 'showTaskDetail',
    'statistics/task/audit-task/:id': 'showAuditTask',
    'statistics/questionnaire/count/:classId': 'showCount',
    'programme/preview-task/:id': 'previewTask',
    'signup/:id': 'showSignupPage',
    signup: 'showUnregisterSignupPage',
    'service/views/research-answer/:id': 'showResearchAnswerDetail',
    'service/views/research-detail/:id': 'showResearchDetail'
};

exports.showIndex = function(id) {
    return this.app.show('content', 'train/index', { id: id });
};

exports.showResponse = function() {
    return this.app.show('content', 'train/response');
};

exports.showPreview = function(id) {
    return this.app.show('content', 'train/programme/preview', { id: id });
};

exports.showClassInfos = function() {
    return this.app.show('content', 'train/classinfos');
};

exports.showProjects = function() {
    return this.app.show('content', 'train/projects');
};

exports.showTrain = function(id) {
    return this.app.show('content', 'train/index/', { id: id });
};

exports.showTaskDetail = function(fir, id) {
    return this.app.viewport.showIt('content', 'train/service/views/commit-task/task-detail', { id: id });
};

exports.showCount = function(fir, classId) {
    return this.app.viewport.showIt('content', 'train/statistics/questionnaire/count', { classId: classId });
};

exports.showAuditTask = function(fir, id) {
    return this.app.viewport.showIt('content', 'train/statistics/task/audit-task', { id: id });
};

exports.previewTask = function(fir, id) {
    return this.app.viewport.showIt('content', 'train/programme/preview-task', { id: id });
};

exports.showSignupPage = function(classId) {
    return this.app.show('content', 'train/signup', { classId: classId });
};

exports.showUnregisterSignupPage = function() {
    return this.app.show('content', 'train/unregister-signup');
};

exports.showResearchDetail = function(fir, id) {
    return this.app.viewport.showIt('content', 'train/service/views/research-detail', { researchQuestionaryId: id });
};

exports.showResearchAnswerDetail = function(fir, id) {
    return this.app.viewport.showIt('content', 'train/service/views/research-answer', { researchRecordId: id });
};

exports.interceptors = {
    'class-detail/task-detail/': 'clearHeadAndBottom',
    'statistics/task/audit-task/': 'clearHeadAndBottom',
    'statistics/questionnaire/count/': 'clearHeadAndBottom',
    'programme/preview-task': 'clearHeadAndBottom',
    'service/views/research-answer/': 'clearHeadAndBottom',
    'service/views/research-detail/': 'clearHeadAndBottom'
};

exports.clearHeadAndBottom = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
