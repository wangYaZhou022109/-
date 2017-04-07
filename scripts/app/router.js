exports.routes = {
    home: 'showHome',
    'home/:configId': 'previewHome',
    'home/org/:orgId': 'changeHome',
    'share/:id/:type': 'showShare', // 分享跳转
    'message/detail/:id': 'showMessageDetail',
    'center/demand': 'showDmand',
    'center/class-service': 'classService',
    'center/managements': 'showManagements'
};

exports.showHome = function() {
    return this.app.show('content', 'home/default');
};

exports.previewHome = function(configId) {
    return this.app.show('content', 'home/default', { configId: configId });
};

exports.changeHome = function(orgId) {
    return this.app.show('content', 'home/default', { orgId: orgId });
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
exports.classService = function() {
    return this.app.show('content', 'center/class-service');
};
exports.showManagements = function() {
    return this.app.show('content', 'center/managements');
};
