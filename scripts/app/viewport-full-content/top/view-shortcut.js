var $ = require('jquery'),
    _ = require('lodash/collection');
exports.bindings = {
    message: true,
    integral: true,
    courseTime: true,
    organizations: true
};

exports.events = {
    'click login': 'toLogin',
    'click logout': 'doLogout',
    'click register': 'toRegister',
    'click menu-*': 'taggleMenus',
    'click theme-*': 'changeTheme',
    'click search': 'showSearchMore',
    'click message-more': 'showMessage',
    'click message-div': 'showMessage',
    'mouseover message-div': 'refreshMessage',
    'click org-*': 'changeHome'
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
    }
};

exports.dataForTemplate = {
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
    }
};
