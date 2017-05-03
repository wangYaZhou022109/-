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
    signup: 'showRegisterPage',
    'class-detail/research-answer/:id': 'showResearchAnswerDetail',
    'class-detail/research-detail/:id': 'showResearchDetail',
    'class-detail/:id': 'showClassDetail'
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
    return this.app.viewport.showIt('content', 'train/class-detail/commit-task/task-detail', { id: id });
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

exports.showRegisterPage = function() {
    return this.app.show('content', 'train/register');
};

exports.showResearchDetail = function(fir, id) {
    return this.app.viewport.showIt('content', 'train/class-detail/research-detail', { researchQuestionaryId: id });
};

exports.showResearchAnswerDetail = function(fir, id) {
    return this.app.viewport.showIt('content', 'train/class-detail/research-answer', { researchRecordId: id });
};

exports.showClassDetail = function(classId) {
    return this.app.show('content', 'train/class-detail', { classId: classId });
};

exports.interceptors = {
    'class-detail/task-detail/': 'clearHeadAndBottom',
    'statistics/task/audit-task/': 'clearHeadAndBottom',
    'statistics/questionnaire/count/': 'clearHeadAndBottom',
    'programme/preview-task': 'clearHeadAndBottom',
    'class-detail/research-answer/': 'clearHeadAndBottom',
    'class-detail/research-detail/': 'clearHeadAndBottom'
};

exports.clearHeadAndBottom = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
