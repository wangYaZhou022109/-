var $ = require('jquery');

exports.routes = {
    'index/:id': 'showIndex',
    'programme/preview/:id': 'showPreview',
    response: 'showResponse',
    classinfos: 'showClassInfos',
    projects: 'showProjects',
    train: 'showTrain',
    'class-detail/task-detail/:id': 'showTaskDetail',
    'statistics/task/audit-task/:id': 'showTaskDetail'
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

exports.interceptors = {
    'class-detail/task-detail/': 'clearHeadAndBottom',
    'statistics/task/audit-task/': 'clearHeadAndBottom',
};

exports.clearHeadAndBottom = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
