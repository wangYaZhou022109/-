var D = require('drizzlejs'),
    picker = require('../picker/strings');

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
    'no-data': '没有数据'
};

var ss = D.assign({}, strings, picker);

exports.get = function(key) {
    if (!ss[key]) throw new Error('Key [' + key + '] is not defined');
    return ss[key];
};
