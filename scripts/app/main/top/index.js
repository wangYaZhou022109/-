var menus = [{
    createTime: 1474538557153,
    icon: null,
    id: '1',
    level: 2,
    name: '首页',
    order: 0,
    parentId: null,
    uri: 'home/index'
}, {
    createTime: 1474538557153,
    icon: null,
    id: '2',
    level: 2,
    name: '课程',
    order: 0,
    parentId: null,
    uri: 'course/index'
}, {
    createTime: 1474538557153,
    icon: null,
    id: '3',
    level: 2,
    name: '活动',
    order: 0,
    parentId: null,
    uri: 'activity/index'
}, {
    createTime: 1474538557153,
    icon: null,
    id: '4',
    level: 2,
    name: '问道',
    order: 0,
    parentId: null,
    uri: 'ask/index'
}, {
    createTime: 1474538557153,
    icon: null,
    id: '5',
    level: 2,
    name: '应用',
    order: 0,
    parentId: null,
    uri: 'app/index'
}];

exports.items = {
    nav: 'nav',
    shortcut: 'shortcut',
    logo: 'logo',
    'main/menu': { region: 'top-tree', isModule: true }
};

exports.store = {
    models: {
        setting: { url: '../system/setting' },
        menus: { data: menus }
    },
    callbacks: {
        init: function() {
            var setting = this.models.setting;
            this.get(setting).then();
        },
        'app.pushState': function() {
            this.module.dispatch('init');
        }
    }
};
