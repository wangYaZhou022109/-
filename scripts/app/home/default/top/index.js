var _ = require('lodash/collection'),
    $ = require('jquery');

var menus = [{
    createTime: 1474538557153,
    icon: null,
    id: '1',
    level: 2,
    name: '首页',
    order: 0,
    parentId: null,
    uri: 'home'
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
    logo: 'logo'
};

function getParams () {
    var params = {};
    window.location.search.substr(1).split('&').forEach(function(kv) {
        var kvarr = kv.split('=');
        params[kvarr[0]] = kvarr[1];
    });
    return params;
}

exports.store = {
    models: {
        setting: { url: '../system/setting' },
        menus: { data: menus },
        navs: { url: '../system/home-nav' }
    },
    callbacks: {
        init: function() {
            // var setting = this.models.setting;
            // this.get(setting).then();
            this.models.navs.params = {
                homeConfigId: getParams().configid
            };
            return this.get(this.models.navs);
        },
        'app.pushState': function(hash) {
            // 设置top菜单的active状态
            var muduleName = hash.slice(0, hash.indexOf('/')),
                dataMenus = this.module.items.nav.$$('a[data-menu]'),
                matchModule;
            if (!(muduleName)) {
                return false;
            }
            matchModule = _.find(dataMenus, function(menu) {
                return $(menu).attr('data-menu') && $(menu).attr('data-menu').indexOf(muduleName) > -1;
            });
            $(dataMenus).removeClass('active');
            $(matchModule).addClass('active');
            return true;
        }
    }
};
exports.beforeRender = function() {
    this.dispatch('init');
};
