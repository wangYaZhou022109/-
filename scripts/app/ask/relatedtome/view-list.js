var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    trends: true,
    popupstate: true
};

exports.events = {
    'click dynamic-*': 'details',
    'click discuss-*': 'discuss',
    'click trend-report-*': 'report'
};

exports.handlers = {
    details: function(id, e, target) {
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
    'click publish-*': 'publish'
};
exports.dataForActions = {
    follow: function(payload) {
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
