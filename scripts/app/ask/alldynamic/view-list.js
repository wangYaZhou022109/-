// var D = require('drizzlejs');
// var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    trends: true
};

exports.events = {
    'click myquiz-details-*': 'showDetails',
    'click discuss-*': 'discuss',
    'click trend-report-*': 'report'
};

exports.handlers = {
    showDetails: function(payload) {
       // var region,
       //     data = { };
       // var el = $(target).parents('.comment-list')[0];
        var data = { },
            id = payload;
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            // region = new D.Region(this.app, this.module, el, data[1]);
            // region.show('ask/myquiz/details', { id: data[1] });
            this.app.show('content', 'ask/myquiz/details', { id: data[1] });
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
