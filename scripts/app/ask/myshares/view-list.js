var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    params: false,
    myshares: true,
    page: true,
    down: false
};

exports.events = {
    'click myshares-details-*': 'showDetails',
    'click discuss-*': 'discuss',
    'click myshares-sharedetails-*': 'showShare'
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
    showShare: function(payload) {
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
            this.app.show('content', 'ask/myshares/sharedetails', { id: data[1] });
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
    'click publish-*': 'publish',
    'click praise-*': 'praise',
    'click unpraise-*': 'unpraise',
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

        return data;
    },
    publish: function(payload) {
        return payload;
    },
    praise: function(payload) {
        var data = {};
        var obj = payload.id.split('_');
        data.objectType = obj[0];
        data.id = obj[1];
        return data;
    },
    unpraise: function(payload) {
        var data = {};
        var obj = payload.id.split('_');
        data.objectType = obj[0];
        data.id = obj[1];
        return data;
    },
};

exports.actionCallbacks = {
    remove: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init');
    },
    follow: function(data) {
        var concern = data[0];
        var unfollow = this.$('trend-unfollow-' + concern.concernType + '_' + concern.concernId);
        var follow = this.$('trend-follow-' + concern.concernType + '_' + concern.concernId);
        var me = this;
        follow.hidden = true;
        unfollow.hidden = false;
        setTimeout(function() {
            me.app.message.success('关注成功！');
            me.module.dispatch('refresh');
        }, 1000);
    },
    unfollow: function(data) {
        var concern = data[0];
        var unfollow = this.$('trend-unfollow-' + concern.concernType + '_' + concern.concernId);
        var follow = this.$('trend-follow-' + concern.concernType + '_' + concern.concernId);
        var me = this;
        follow.hidden = false;
        unfollow.hidden = true;
        setTimeout(function() {
            me.app.message.success('取消成功！');
            me.module.dispatch('refresh');
        }, 1000);
    },
    shut: function() {
        this.app.message.success('删除成功!');
        // this.module.dispatch('init');
    },
    publish: function() {
        this.app.message.success('操作成功！');
        // this.module.dispatch('init');
    },
    praise: function() {
        this.app.message.success('点赞成功！');
        // this.module.dispatch('init');
    },
    unpraise: function() {
        this.app.message.success('取消点赞成功！');
        // this.module.dispatch('init');
    }
};
exports.dataForTemplate = {
    page: function(data) {
        var myshares = data.myshares;
        var page = this.bindings.page.data;
        var me = this;
        var flag = true;
        _.forEach(myshares, function(value) {
            var obj = value,
                date = new Date(obj.createTime);
            var url = obj.member.headPortrait;
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.member.headPortrait = 'images/default-userpic.png';
            } else {
                obj.member.headPortrait = me.bindings.down.getFullUrl() + '?id=' + url;
            }
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
    },
    countNum: function(data) {
        // console.log(data);
        var myshares = data.myshares,
            countNum = 0;
        if (myshares.length > 0) {
            countNum = myshares[0].countNum;
        }
        return countNum;
    }
};

exports.beforeClose = function() {
    $(window).unbind('scroll');
};

