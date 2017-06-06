var D = require('drizzlejs');
var _ = require('lodash/collection');
var $ = require('jquery');
exports.bindings = {
    state: true,
    topicname: true,
    topicType: true,
    down: false
};

exports.events = {
    'click apply-topic': 'showApplyTopic',
    'click detail-*': 'showDetails',
    'click checkOne-*': 'showCheckone',
    'click checkAll': 'showCheckall'
};

exports.handlers = {
    showApplyTopic: function() {
        var model = this.module.items['ask/topicsquare/apply-topic'];
        this.app.viewport.modal(model);
    },
    toggleMore: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/topicsquare/topicdetail', { id: id });
    },
    showDetails: function(payload) {
        // var data = { },
        //     id = payload;
        // console.log(payload);
        // if (id.indexOf('_') !== -1) {
        //     data = id.split('_');
            // region = new D.Region(this.app, this.module, el, data[1]);
            // region.show('ask/myquiz/details', { id: data[1] });
        this.app.show('content', 'ask/mymanage/topicdetail', { id: payload });
        // }
    },
    showCheckone: function(id) {
        $(this.$('checkOne-' + id)).addClass('active').siblings().removeClass('active');
    },
    showCheckall: function() {
        $(this.$('checkAll')).addClass('active').siblings().removeClass('active');
    }
};
exports.actions = {
    'click follow-*': 'follow',
    'click unfollow-*': 'unfollow',
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
    }
};
exports.actionCallbacks = {
    follow: function() {
        // var concern = data[0];
        // var unfollow = this.$('unfollow-' + concern.concernType + '_' + concern.concernId);
        // var follow = this.$('follow-' + concern.concernType + '_' + concern.concernId);
        // // var me = this;
        // follow.hidden = true;
        // unfollow.hidden = false;
        this.app.message.success('关注成功！');
        this.module.dispatch('refresh');
        this.module.dispatch('init');
    },
    unfollow: function() {
        // var concern = data[0];
        // var unfollow = this.$('unfollow-' + concern.concernType + '_' + concern.concernId);
        // var follow = this.$('follow-' + concern.concernType + '_' + concern.concernId);
        // // var me = this;
        // follow.hidden = false;
        // unfollow.hidden = true;
        this.app.message.success('取消成功！');
        this.module.dispatch('refresh');
        this.module.dispatch('init');
    }
};
exports.dataForTemplate = {
    topicname: function(data) {
        var topicname = data.topicname,
            me = this;
        _.forEach(topicname, function(value) {
            var obj = value,
                url = obj.attachmentId;
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.attachmentId = 'images/default-cover/default_topic.jpg';
            } else {
                obj.attachmentId = me.bindings.down.getFullUrl() + '?id=' + url;
            }
        });
        return topicname;
    }
};
