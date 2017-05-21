exports.routes = {
    home: 'showHome',
    search: 'showSearchPage',
    'home/:configId': 'previewHome',
    'home/org/:orgId': 'changeHome',
    'share/:id/:type': 'showShare', // 分享跳转
    'message/detail/:id': 'showMessageDetail',
    'center/demand': 'showDmand',
    'center/responsecenter': 'showResponsecenter',
    'center/class-service': 'classService',
    'center/managements': 'showManagements',
    'center/notloggin': 'showNotloggin',
    'center/managements/statistics': 'showStatistics',
    'center/managements/taskmarking': 'showTaskmarking',
    'home/home-advertisement/:id': 'showDetail'

};

exports.showHome = function() {
    return this.app.show('content', 'home/default');
};

exports.previewHome = function(configId) {
    document.cookie = 'orgId=';
    document.cookie = 'configId=' + configId;
    return this.app.show('content', 'home/default', { configId: configId, forceRender: true });
};

exports.changeHome = function(orgId) {
    document.cookie = 'configId=';
    document.cookie = 'orgId=' + orgId;
    return this.app.show('content', 'home/default', { orgId: orgId, forceRender: true });
};

exports.showMessageDetail = function(id) {
    return this.app.show('content', 'home/message/detail', {
        id: id
    });
};

exports.showDemo = function() {
    return this.app.show('content', 'demo');
};

exports.showShare = function(id, type) {
    var webUrl = window.location.protocol + '//' + window.location.host; // 域名加端口
    if (type === '1') { // 课程
        webUrl += '/#/study/course/detail/' + id;
    } else if (type === '2') { // 学习路径
        webUrl += '/#//' + id;
    } else if (type === '3') { // 知识
        webUrl += '/#/knowledge/detail/' + id;
    } else if (type === '4') { // 班级
        webUrl += '/#//' + id;
    } else if (type === '5') { // 调研
        webUrl += '/#/exam/research-activity/index/' + id;
    } else if (type === '6') { // 微课大赛
        webUrl += '/#//' + id;
    } else if (type === '7') { // 考试
        webUrl += '/#/exam/index/' + id;
    } else if (type === '8') { // 专题
        webUrl += '/#/study/subject/detail/' + id;
    } else if (type === '10') { // 问题
        webUrl += '/#//' + id;
    } else if (type === '11') { // 讨论
        webUrl += '/#//' + id;
    }
    window.location.href = webUrl;
};
exports.showDmand = function() {
    return this.app.show('content', 'center/demand');
};
exports.showResponsecenter = function() {
    return this.app.show('content', 'center/responsecenter');
};
exports.classService = function() {
    return this.app.show('content', 'center/class-service');
};
exports.showManagements = function() {
    return this.app.show('content', 'center/managements');
};
exports.showNotloggin = function() {
    return this.app.show('content', 'center/notloggin');
};
exports.showStatistics = function() {
    return this.app.viewport.showIt('content', 'center/managements/statistics');
};
exports.showTaskmarking = function() {
    return this.app.viewport.showIt('content', 'center/managements/taskmarking');
};
exports.showSearchPage = function() {
    return this.app.show('content', 'search-page');
};
exports.showDetail = function(id) {
    return this.app.show('content', 'home/advertisement', { id: id });
};
