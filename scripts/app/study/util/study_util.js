var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    options = {
        charset: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        before: '第',
        after: '节'
    },
    contentType = {
        // 1 文档  2 图片
        'application/vnd.ms-excel': 1,
        'application/pdf': 1,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 1,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 1,
        'application/msword': 1,
        'application/octet-stream': 1,
        'application/msexcel': 1,
        'image/jpeg': 2,
        'audio/mp3': 5,
        'video/mp4': 6
    };

exports.rowHeader = function(arr, payload) {
    var opt = D.assign(options, payload);
    _.map(arr || [], function(obj, i) {
        var c = obj;
        c.i = opt.before + opt.charset[i] + opt.after;
        if (i === 0) c.first = true;
        if (i === arr.length - 1) c.last = true;
    });
};
exports.getContentType = function(value) {
    return contentType[value] || 1;
};
