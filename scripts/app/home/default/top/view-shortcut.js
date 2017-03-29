var $ = require('jquery');

exports.bindings = {
    message: true,
    integral: true,
    courseTime: true
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
    'mouseover message-div': 'refreshMessage'
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
    }
};

exports.dataForTemplate = {
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
