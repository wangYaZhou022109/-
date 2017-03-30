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
    uri: 'study/course/index'
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
    name: '专题',
    order: 0,
    parentId: null,
    uri: 'study/subject/index'
}, {
    createTime: 1474538557153,
    icon: null,
    id: '6',
    level: 2,
    name: '知识',
    order: 0,
    parentId: null,
    uri: 'knowledge/index'
}];

exports.items = {
    nav: 'nav',
    shortcut: 'shortcut',
    logo: 'logo',
    'home/message': { isModule: true }
};

exports.store = {
    models: {
        menus: { data: menus },
        navs: { url: '../system/home-nav' },
        homeConfig: { url: '../system/home-config/config' },
        message: {
            url: '../system/message',
            params: { page: 1, pageSize: 5, type: 1, readStatus: 0 }
        },
        organizations: { url: '../system/home-config/organization', autoLoad: 'after' },
        integral: { url: '../system/integral-result/grade' }, // 积分和等级
        courseTime: { url: '../course-study/course-study-progress/total-time' } // 总学习时长
    },
    callbacks: {
        init: function(payload) {
            var configId = payload.configId,
                orgId = payload.orgId,
                that = this,
                homeConfig = this.models.homeConfig,
                navs = this.models.navs;
            homeConfig.params = { id: configId, orgId: orgId };
            return this.get(homeConfig).then(function() {
                if (homeConfig.data) {
                    navs.params.homeConfigId = homeConfig.data.id;
                    return that.get(navs);
                }
                return null;
            });
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
        },
        refreshMessage: function() {
            return this.get(this.models.message);
        },
        loadMessage: function() {
            if (this.app.global.currentUser.id) {
                this.get(this.models.message);
            }
        },
        loadIntegral: function() {
            if (this.app.global.currentUser.id) {
                this.get(this.models.integral);
            }
        },
        loadCourseTime: function() {
            if (this.app.global.currentUser.id) {
                this.get(this.models.courseTime);
            }
        }
    }
};
exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions || {});
};

exports.afterRender = function() {
    this.dispatch('loadMessage');
    this.dispatch('loadIntegral');
    this.dispatch('loadCourseTime');
};