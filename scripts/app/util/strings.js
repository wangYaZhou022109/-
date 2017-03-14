var D = require('drizzlejs'),
    ask = require('../ask/strings'),
    study = require('../study/strings'),
    activity = require('../activity/strings'),
    exam = require('../exam/strings'),
    center = require('../center/strings');

var strings = {
    ok: '确定',
    cancel: '取消',
    edit: '编辑',
    view: '查看',
    remove: '删除',
    operating: '操作',
    enable: '启用',
    disable: '禁用',
    'import-data': '导入',
    preview: '预览',
    add: '新增',
    save: '保存',
    search: '搜索',
    'no-data': '没有数据',
    download: '下载',
    'submit-success': '提交成功',
    'operation-success': '操作成功'
};

var ss = D.assign({}, strings, study, activity, ask, exam, center);

exports.get = function(key) {
    if (!ss[key]) throw new Error('Key [' + key + '] is not defined');
    return ss[key];
};
