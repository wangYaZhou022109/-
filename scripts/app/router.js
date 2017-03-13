var $ = require('jquery');

exports.routes = {
    home: 'showHome',
    'share/:id/:type': 'showShare' // 分享跳转
};

exports.showHome = function() {
    return this.app.show('content', 'home/layout');
};

exports.showShare = function(id, type) {
    var webUrl = window.location.protocol + '//' + window.location.host; // 域名加端口
    if (type === '1') { // 课程
        webUrl += '/#/study/course/detail/' + id;
    } else if (type === '2') { // 学习路径
        webUrl += '/#//' + id;
    } else if (type === '3') { // 知识
        webUrl += '/#//' + id;
    } else if (type === '4') { // 班级
        webUrl += '/#//' + id;
    } else if (type === '5') { // 调研
        webUrl += '/#/exam/index/' + id;
    } else if (type === '6') { // 微课大赛
        webUrl += '/#//' + id;
    } else if (type === '7') { // 考试
        webUrl += '/#/exam/index/' + id;
    } else if (type === '8') { // 专题
        webUrl += '/#//' + id;
    } else if (type === '10') { // 问题
        webUrl += '/#//' + id;
    } else if (type === '11') { // 讨论
        webUrl += '/#//' + id;
    }
    window.location.href = webUrl;
};

exports.interceptors = {
    activity: 'showHead'
};

exports.showHead = function() {
    $('.header').show();
    $('.footer').show();
    $('.achievement-content').attr('height', '0%');
};
