var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    reply: true
};

exports.events = {
    'click reply-*': 'showDetails',
    'click report-*': 'report',
    'click discuss-*': 'discuss'
};

exports.handlers = {
    showDetails: function(payload) {
       // var region,
       //     data = { };
       // var el = $(target).parents('.comment-list')[0];
        // var data = { },
        //     id = payload;
        // console.log(payload);
        // if (id.indexOf('_') !== -1) {
        //     data = id.split('_');
            // region = new D.Region(this.app, this.module, el, data[1]);
            // region.show('ask/myquiz/details', { id: data[1] });
        this.app.show('content', 'ask/mymanage/topicdetail/exp/details', { id: payload });
       //  }
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

exports.dataForTemplate = {
    reply: function(data) {
        var reply = data.reply;
        _.forEach(reply, function(value) {
            var obj = value,
                date = new Date(obj.createTime);
            obj.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '   ' + date.getHours() + ':' + date.getMinutes();
        });
        return reply;
    }
};
exports.actions = {
    'click follow-*': 'follow',
    'click unfollow-*': 'unfollow',
    'click shut-*': 'shut',
    'click publish-*': 'publish'
};
exports.dataForActions = {
    shut: function(payload) {
        var data = payload;
        data.closeStatus = 1;
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
    follow: function() {
        this.app.message.success('关注成功！');
        this.module.dispatch('init');
    },
    unfollow: function() {
        this.app.message.success('取消成功！');
        this.module.dispatch('init');
    },
    shut: function() {
        this.app.message.success('关闭成功！');
        this.module.dispatch('init');
    }
};
