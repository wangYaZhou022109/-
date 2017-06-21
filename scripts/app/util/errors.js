var D = require('drizzlejs'),
    study = require('../study/errors'),
    exam = require('../exam/errors'),
    center = require('../center/errors'),
    activity = require('../activity/errors');

var messages = {
    1: '操作失败, 您没有此权限',
    2: '操作失败, 请重试',
    3: '操作失败, 请与客服联系',

    900000: '验证失败, 请重试',
    900001: '属性值必填',
    900002: '格式错误',
    900003: '文件大小超出限制',
    900004: '文件类型不支持'
};

var ms = D.assign({}, messages, study, exam, activity, center);

exports.get = function(key) {
    if (!ms[key]) throw new Error('Key [' + key + '] is not defined');
    return ms[key];
};
