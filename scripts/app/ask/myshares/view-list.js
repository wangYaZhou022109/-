var $ = require('jquery');
exports.type = 'dynamic';
exports.bindings = {
    params: false,
    myshares: true
};

exports.events = {
    'click myshares-details-*': 'showDetails',
    'click discuss-*': 'discuss'
};

exports.handlers = {
    showDetails: function(payload) {
       // var region,
       //     data = { };
       // var el = $(target).parents('.comment-list')[0];
        var data = { },
            id = payload;
        // console.log(payload);
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            // region = new D.Region(this.app, this.module, el, data[1]);
            // region.show('ask/myquiz/details', { id: data[1] });
            this.app.show('content', 'ask/myshares/details', { id: data[1] });
        }
    },
    discuss: function(payload) {
        $(this.$('comment-reply-' + payload)).toggleClass('show');
    }

};

exports.actions = {
    'click report-*': 'report',
    'click trend-follow-*': 'follow',
    'click trend-unfollow-*': 'unfollow',
    'click del-question-*': 'shut',
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
    unfollow: function(payload) {
        var id = payload.id,
            data = {};
        var obj = id.split('_');
        data.id = obj[1];
        data.concernType = obj[0];
        return data;
    },
    shut: function(payload) {
        var data = payload;
        data.closeStatus = 1;
        return data;
    },
    publish: function(payload) {
        return payload;
    }
};

exports.actionCallbacks = {
    remove: function() {
        this.app.message.success('删除成功！');
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
    shut: function() {
        this.app.message.success('关闭成功!');
        this.module.dispatch('init');
    },
    publish: function() {
        this.app.message.success('操作成功！');
        this.module.dispatch('init');
    }
};

