var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    trends: true,
    popupstate: true
};

exports.events = {
    'click dynamic-*': 'toggleMore',
    'click discuss-*': 'discuss',
    'click trend-report-*': 'report'
};

exports.handlers = {
    toggleMore: function(id, e, target) {
        var region,
            data;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, id);
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            region.show('ask/myquiz/details', { id: data[1] });
        }
    },
    discuss: function(payload) {
        var el = this.$(payload);
        if (el.hidden === false) {
            el.hidden = true;
        } else if (el.hidden === true) {
            el.hidden = false;
        }
    },
    report: function(payload) {
        var state = this.bindings.popupstate,
            obj = payload,
            data;
        if (obj.indexOf('_') !== -1) {
            data = obj.split('_');
        }
        state.hidden = true;
        state.data = {};
        state.data.objectType = data[0];
        state.data.id = data[1];
        state.data.title = '举报';
        state.data.menu = 'report';
        state.data.report = true;
        state.changed();
    }
};
exports.actions = {
    'click trend-follow-*': 'follow',
    'click trend-unfollow-*': 'unfollow',
    'click publish-*': 'publish',
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
    trends: function(data) {
        var trends = data.trends;
        _.forEach(trends, function(value) {
            var obj = value,
                date = new Date(obj.createTime);
            obj.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '   ' + date.getHours() + ':' + date.getMinutes();
        });
        return trends;
    }
};
