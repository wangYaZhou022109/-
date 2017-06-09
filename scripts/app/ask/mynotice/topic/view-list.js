var _ = require('lodash');
exports.type = 'dynamic';
exports.bindings = {
    topic: true,
    topicType: true,
    down: true
};

exports.events = {
};

exports.handlers = {
};

exports.actions = {
    'click check-*': 'check',
    'click unfollow-topic-*': 'unfollow'
};

exports.dataForActions = {
    check: function(payload) {
        return payload;
    },
    unfollow: function(payload) {
        var data = payload;
        data.concernType = '4';
        return data;
    }
};

exports.actionCallbacks = {
};

exports.dataForTemplate = {
    topic: function(data) {
        var topic = data.topic,
            me = this;
        if (_.isEmpty(topic.topicList)) {
            topic.topicListFlag = true;
        } else {
            topic.topicListFlag = false;
        }
        _.forEach(topic.topicList, function(value) {
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
