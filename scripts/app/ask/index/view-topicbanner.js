var $ = require('jquery');
var _ = require('lodash/collection');

exports.bindings = {
    topic: true,
    down: true
};
exports.events = {
    'click closetopic': 'closeTopic'
};

exports.handlers = {
    closeTopic: function() {
        $(this.$('topbanner')).hide();
    }
};

exports.actions = {
    'click follow-*': 'follow',
    'click unfollow-*': 'unfollow'
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
    follow: function(data) {
        var concern = data[0];
        var unfollow = this.$('unfollow-' + concern.concernType + '_' + concern.concernId);
        var follow = this.$('follow-' + concern.concernType + '_' + concern.concernId);
        follow.hidden = true;
        unfollow.hidden = false;
        this.app.message.success('关注成功！');
        this.module.dispatch('refresh');
        // this.module.dispatch('init');
    },
    unfollow: function(data) {
        var concern = data[0];
        var unfollow = this.$('unfollow-' + concern.concernType + '_' + concern.concernId);
        var follow = this.$('follow-' + concern.concernType + '_' + concern.concernId);
        follow.hidden = false;
        unfollow.hidden = true;
        this.app.message.success('取消成功！');
        this.module.dispatch('refresh');
        // this.module.dispatch('init');
    }
};
exports.dataForTemplate = {
    topic: function(data) {
        var topic = data.topic,
            me = this;
        _.forEach(topic, function(value) {
            var obj = value,
                url = obj.attachmentId;
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.attachmentId = 'images/default-cover/default_topic.jpg';
            } else {
                obj.attachmentId = me.bindings.down.getFullUrl() + '?id=' + url;
            }
        });
        return topic;
    }
};
