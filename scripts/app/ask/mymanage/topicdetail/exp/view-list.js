var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    trends: true
};

exports.events = {
    'click mymanage-details-*': 'showDetails'
};
exports.actions = {
    'click setEssenceStatus-*': 'setEssenceStatus',
    'click shut-*': 'shut',
    'click discuss-top-*': 'discusstop'
};
exports.handlers = {
    dynamic: function() {
    },
    toggleMore: function(id, e, target) {
        var region,
            data;
        var el = $(target).parents('.comment-list')[0];
        region = new D.Region(this.app, this.module, el, id);
        if (id.indexOf(',') !== -1) {
            data = id.split(',');
            region.show('ask/myquiz/details', { id: data[1] });
        }
    },
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
            this.app.show('content', 'ask/mymanage/topicdetail/exp/details', { id: data[1] });
        }
    }
};
exports.dataForActions = {
    setEssenceStatus: function(payload) {
        var data = payload;
        data.essenceStatus = 1;
        return data;
    },
    shut: function(payload) {
        var data = payload;
        data.closeStatus = 1;
        return data;
    },
    discusstop: function(payload) {
        return payload;
    }
};
exports.actionCallbacks = {
    setEssenceStatus: function() {
        this.app.message.success('加精成功!');
        this.module.dispatch('init');
    },
    shut: function() {
        this.app.message.success('关闭成功!');
        this.module.dispatch('init');
    },
    discusstop: function(payload) {
        this.app.message.success('置顶成功！');
        this.module.dispatch('refresh', payload);
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
