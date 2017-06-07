var $ = require('jquery'),
    _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    D = require('drizzlejs'),
    SEARCH_URL = 'search',
    viewUtil = require('./app/full-text-search/view-util');
exports.bindings = {
    message: true,
    integral: true,
    courseTime: true,
    organizations: true,
    state: true,
    msgCount: true,
    hotTopics: true
};

exports.events = {
    'click login': 'toLogin',
    'click logout': 'doLogout',
    'click register': 'toRegister',
    'click menu-*': 'taggleMenus',
    'click theme-*': 'changeTheme',
    'click searchContent': 'showSearchMore',
    'click message-more': 'showMessage',
    'click message-div': 'showMessage',
    'mouseover message-div': 'refreshMessage',
    'click org-*': 'changeHome',
    'click remove-*': 'removeHistory',
    'mouseover searchMore': 'showSearchMore',
    'mouseout searchMore': 'hideSearchMore'
};

exports.actions = {
    'click searchBtn': 'searchByName',
    'click clearHistory': 'clearHistory',
    'keypress searchContent': 'enterSearch',
    'click historyName-*': 'historyName',
    'click topic-*': 'searchByTopic'
};

exports.handlers = {
    toLogin: function() {
        this.app.redirectToLogin();
    },

    toRegister: function() {
        this.app.redirectToRegister();
    },

    doLogout: function() {
        this.$('logoutForm').submit();
    },
    taggleMenus: function(id) {
        $(this.$('menu-' + id)).addClass('current').siblings().removeClass('current');
    },
    changeTheme: function(id) {
        document.querySelector('html').className = id;
        $(this.$('theme-' + id)).addClass('active').siblings().removeClass('active');
    },
    showSearchMore: function() {
        $(this.$('searchMore')).addClass('show');
    },
    hideSearchMore: function() {
        $(this.$('searchMore')).removeClass('show');
    },
    showMessage: function() {
        var model = this.module.items['home/message'];
        this.app.viewport.modal(model);
    },
    refreshMessage: function() {
       // var me = this;
        // me.module.dispatch('refreshMessage');
    },
    changeHome: function(id) {
        this.app.navigate('home/org/' + id, true);
    },
    removeHistory: function(id) {
        this.module.dispatch('removeHistory', { id: id });
    }
};

exports.dataForActions = {
    searchByName: function(payload) {
        var params = payload,
            time = new Date().getTime();
        params.id = D.uniqueId('search') + time;
        params.time = time;
        if (params.searchContent) {
            $(this.$('searchPannel')).hide();
            return params;
        }
        return false;
    },
    enterSearch: function(payload, e) {
        var params = payload,
            time = new Date().getTime();
        if (e.keyCode === 13 && params.searchContent) {
            params.id = D.uniqueId('search') + time;
            params.time = time;
            $(this.$('searchPannel')).hide();
            return params;
        }
        return false;
    },
    historyName: function(payload) {
        var type = $(this.$$('[name="searchType"]')).val();
        $(this.$('searchPannel')).hide();
        return { searchType: type, id: payload.id };
    },
    searchByTopic: function(payload) {
        var params = payload,
            time = new Date().getTime();
        params.uniqueId = D.uniqueId('search') + time;
        params.time = time;
        $(this.$('searchPannel')).hide();
        return params;
    }
};

exports.dataForTemplate = {
    msgCount: function(data) {
        var msgCount = data.msgCount;
        if (msgCount > 0) {
            return msgCount;
        } else if (msgCount > 99) {
            return '99+';
        }
        return '';
    },
    organization: function(data) {
        var organization = data.organization || {},
            params = {},
            rootOrganization = this.app.global.organization,
            companyOrganization = this.app.global.currentUser.companyOrganization || {};
        if (document.cookie) {
            document.cookie.split('; ').forEach(function(item) {
                var arr = item.split('=');
                if (arr[1] !== 'undefined' || arr[1] !== '') {
                    params[arr[0]] = arr[1];
                }
            });
        }
        if (params.orgId && params.orgId === companyOrganization.id) {
            organization = companyOrganization;
        } else {
            organization = rootOrganization;
        }
        return organization;
    },
    organizations: function(data) {
        var organizations = data.organizations || [];
        organizations = _.reject(organizations, ['id', this.app.global.organization.id]);
        return organizations;
    },
    courseTime: function(data) {
        var time = '',
            second = 0, // 秒
            minute = 0, // 分
            hour = 0; // 小时
        second = data.courseTime == null ? 0 : window.parseInt(data.courseTime);
        if (second > 60) {
            minute = window.parseInt(second / 60);
            second = window.parseInt(second % 60);
            if (minute > 60) {
                hour = window.parseInt(minute / 60);
                minute = window.parseInt(minute % 60);
            }
            if (second >= 30) {
                minute += 1;
            }
        }
        time = second;
        if (minute > 0) {
            time = minute + '分';// + time;
        }
        if (hour > 0) {
            time = hour + '小时' + time;
        }
        return time;
    },
    searchTypes: function() {
        return maps.get('search-type');
    },
    searchHistorys: function() {
        var searchHistorys = viewUtil.getSearchHistory();
        var arrays = _.orderBy(
            _.filter(searchHistorys || [], function(o) { return o.searchContent; }) || [],
            ['time'], ['desc']).slice(0, 6);
        return _.map(arrays, function(obj) {
            var history = obj;
            if (history.searchContent.length > 20) {
                history.searchContent = history.searchContent.substring(0, 20) + '...';
            }
            return history;
        });
    },
    showSearch: function() {
        var searchUrl = window.location.protocol + '//' + window.location.host + '/#/' + SEARCH_URL,
            currentUrl = window.location.href;
        return currentUrl !== searchUrl;
    }
};

exports.actionCallbacks = {
    searchByName: function() {
        this.app.navigate(SEARCH_URL, true);
    },
    enterSearch: function() {
        this.app.navigate(SEARCH_URL, true);
    },
    historyName: function() {
        this.app.navigate(SEARCH_URL, true);
    },
    searchByTopic: function() {
        this.app.navigate(SEARCH_URL, true);
    }
};
