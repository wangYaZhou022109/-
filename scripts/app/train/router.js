var $ = require('jquery');

exports.routes = {
    'index/:id': 'showIndex',
    'sign-detail': 'showSignDetail',
    'programme/preview/:id': 'showPreview',
    response: 'showResponse',
    classinfos: 'showClassInfos',
    projects: 'showProjects',
    'class-detail/task-detail/:id': 'showTaskDetail'
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

exports.showTaskDetail = function(fir, id) {
    return this.app.show('content', 'train/service/views/commit-task/task-detail', { id: id });
};

exports.interceptors = {
    'class-detail/task-detail/': 'clearHeadAndBottom'
};

exports.clearHeadAndBottom = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
