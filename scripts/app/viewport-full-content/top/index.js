var _ = require('lodash/collection'),
    $ = require('jquery'),
    viewUtil = require('./app/full-text-search/view-util'),
    D = require('drizzlejs');

var menus = [{
    createTime: 1474538557153,
    icon: null,
    id: '1',
    level: 2,
    name: '首页',
    order: 0,
    parentId: null,
    url: 'home'
}, {
    createTime: 1474538557153,
    icon: null,
    id: '2',
    level: 2,
    name: '课程',
    order: 0,
    parentId: null,
    url: 'study/course/index'
}, {
    createTime: 1474538557153,
    icon: null,
    id: '3',
    level: 2,
    name: '活动',
    order: 0,
    parentId: null,
    url: 'activity/index'
}, {
    createTime: 1474538557153,
    icon: null,
    id: '4',
    level: 2,
    name: '问道',
    order: 0,
    parentId: null,
    url: 'ask/index'
}, {
    createTime: 1474538557153,
    icon: null,
    id: '5',
    level: 2,
    name: '专题',
    order: 0,
    parentId: null,
    url: 'study/subject/index'
}, {
    createTime: 1474538557153,
    icon: null,
    id: '6',
    level: 2,
    name: '知识',
    order: 0,
    parentId: null,
    url: 'knowledge/index'
}];

exports.items = {
    nav: 'nav',
    shortcut: 'shortcut',
    logo: 'logo',
    'home/message': { isModule: true },
    'home/member-info': { isModule: true }
};

exports.store = {
    models: {
        // menus: { data: [] },
        navs: { url: '../system/home-nav' },
        homeConfig: { url: '../system/home-config/config' },
        message: {
            url: '../system/message-notice',
            params: { page: 1, pageSize: 5, readStatus: 0 }
        },
        organizations: { url: '../system/home-config/organization' },
        integral: { url: '../system/integral-result/grade' }, // 积分和等级
        courseTime: { url: '../course-study/course-study-progress/total-time' }, // 总学习时长
        hotTopics: { url: '../system/topic/hot-all' }, // 热门标签
        msgCount: { url: '../system/msg-count' }, // 消息数
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var that = this,
                homeConfig = this.models.homeConfig,
                navs = this.models.navs;
            homeConfig.params = { configId: payload.configId || '', orgId: payload.orgId || '' };
            homeConfig.clear();
            if (this.app.global.currentUser.organization) {
                this.models.hotTopics.params.limit = 10;
                this.get(this.models.hotTopics);
            }
            return this.get(homeConfig).then(function() {
                if (homeConfig.data) {
                    navs.params.homeConfigId = homeConfig.data.id;
                    navs.clear();
                    that.get(navs).then(function() {
                        if ((!navs.data) || navs.data.length === 0) {
                            navs.clear();
                            D.assign(navs.data, menus);
                            navs.changed();
                        }
                    });
                } else {
                    navs.clear();
                    D.assign(navs.data, menus);
                    navs.changed();
                }
                // return null;
            });
        },
        'app.pushState': function(hash) {
            // 设置top菜单的active状态
            var muduleName = hash, // hash.slice(0, hash.indexOf('/')),
                dataMenus = this.module.items.nav.$$('div[data-menu]'),
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
            this.models.message.clear();
            return this.get(this.models.message);
        },
        loadDataByUser: function() {
            var me = this;
            if (this.app.global.currentUser.id) {
                this.models.message.clear();
                this.models.integral.clear();
                this.models.courseTime.clear();
                this.models.organizations.clear();
                this.models.msgCount.clear();
                this.chain(
                    me.get(me.models.message),
                    me.get(me.models.integral),
                    me.get(me.models.courseTime),
                    me.get(me.models.organizations),
                    me.get(me.models.msgCount)
                );
            }
        },
        showSetting: function() {
            if (this.app.global.currentUser && this.app.global.currentUser.initSetting === 0) {
                this.app.viewport.modal(this.module.items['home/member-info']);
            }
        },
        searchByName: function(payload) {
            viewUtil.addSearchHistory(payload);
            return true;
        },
        enterSearch: function(payload) {
            viewUtil.addSearchHistory(payload);
            return true;
        },
        historyName: function(payload) {
            viewUtil.editSearchHistory(payload);
            return true;
        },
        clearHistory: function() {
            viewUtil.clearSearchHistory();
            this.models.state.changed();
        },
        removeHistory: function(payload) {
            viewUtil.removeSearchHistory(payload);
            this.models.state.changed();
        },
        searchByTopic: function(payload) {
            var topic = _.find(this.models.hotTopics.data || [], { id: payload.id });
            var param = {
                id: payload.uniqueId,
                type: payload.searchType,
                topicId: topic.id,
                topicName: topic.name,
                time: payload.time
            };
            viewUtil.editSearchHistory(param);
            return true;
        }
    }
};
exports.beforeRender = function() {
    var payload = {};
    if (document.cookie) {
        document.cookie.split('; ').forEach(function(item) {
            var arr = item.split('=');
            if (arr[1] !== 'undefined' || arr[1] !== '') {
                payload[arr[0]] = arr[1];
            }
        });
    }
    this.dispatch('init', payload);
};

exports.afterRender = function() {
    var me = this;
    this.dispatch('loadDataByUser');
    this.dispatch('showSetting');
    $(window).on('hashchange', function() {
        me.store.models.state.changed();
    });
};
