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
    'statistics/questionnaire/count/:classId': 'showCount'
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
    return this.app.show('content', 'train/service/views/commit-task/task-detail', { id: id });
};

exports.showCount = function(fir, classId) {
    return this.app.show('content', 'train/statistics/questionnaire/count', { classId: classId });
};

exports.showAuditTask = function(fir, id) {
    return this.app.show('content', 'train/statistics/task/audit-task', { id: id });
};

exports.interceptors = {
    'class-detail/task-detail/': 'clearHeadAndBottom',
    'statistics/task/audit-task/': 'clearHeadAndBottom',
    'statistics/questionnaire/count/': 'clearHeadAndBottom'
};

exports.clearHeadAndBottom = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
