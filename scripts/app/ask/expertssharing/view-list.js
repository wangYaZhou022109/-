var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    trends: true,
    page: true
};

exports.events = {
    'click discuss-*': 'discuss',
    'click trend-report-*': 'report',
    'click myquiz-details-*': 'showDetails'
};

exports.handlers = {
    showDetails: function(payload) {
        var data = { },
            id = payload;
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.show('content', 'ask/myquiz/details', { id: data[1] });
        }
    },
    discuss: function(payload) {
        $(this.$('comment-reply-' + payload)).toggleClass('show');
    },
    report: function(payload) {
        var id = payload,
            data = { };
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.viewport.modal(this.module.items['ask/report'], { id: data[1], objectType: data[0] });
        }
    }
};

exports.actions = {
    'click trend-follow-*': 'follow',
    'click publish-*': 'publish',
    'click trend-unfollow-*': 'unfollow',
    'click reply-*': 'reply',
    'click del-question-*': 'delquestion',
    'click del-share-*': 'delshare',
    'click del-discuss-*': 'deldiscuss'
};

exports.dataForActions = {
    delquestion: function(payload) {
        var data = payload;
        data.auditType = '1';
        return data;
    },
    delshare: function(payload) {
        var data = payload;
        data.auditType = '2';
        return data;
    },
    deldiscuss: function(payload) {
        var data = payload;
        data.auditType = '3';
        return data;
    },
    follow: function(payload) {
        var id = payload.id,
            data = {};
        var obj = id.split('_');
        data.id = obj[1];
        data.concernType = obj[0];
        return data;
    },
    unfollow: function(payload) {
        var id = payload.id,
            data = {};
        var obj = id.split('_');
        data.id = obj[1];
        data.concernType = obj[0];
        return data;
    },
    publish: function(payload) {
        return payload;
    },
    reply: function(payload) {
        return payload;
    }
};
exports.actionCallbacks = {
    reply: function() {
        this.app.message.success('操作成功！');
        this.module.dispatch('init');
    },
    publish: function() {
        this.app.message.success('操作成功！');
        this.module.dispatch('init');
    },
    follow: function() {
        this.app.message.success('关注成功！');
        this.module.dispatch('init');
    },
    unfollow: function() {
        this.app.message.success('取消成功！');
        this.module.dispatch('init');
    },
    delquestion: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init');
    },
    delshare: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init');
    },
    deldiscuss: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init');
    }
};

exports.dataForTemplate = {
    page: function(data) {
        var trends = data.trends;
        var page = this.bindings.page.data;
        var me = this;
        var flag = true;
        _.forEach(trends, function(value) {
            var obj = value,
                date = new Date(obj.createTime);
            obj.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '   ' + date.getHours() + ':' + date.getMinutes();
            _.forEach(me.bindings.page.data, function(v) {
                if (v.id === obj.id) {
                    flag = false;
                }
            });
            if (flag) {
                page.push(obj);
            }
        });
        return page;
    }
};

exports.beforeClose = function() {
    $(window).unbind('scroll');
};
