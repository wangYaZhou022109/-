var _ = require('lodash/collection');
var $ = require('jquery');
exports.type = 'dynamic';
exports.bindings = {
    topic: true,
    down: true
};

exports.events = {
    'click topic-more': 'topicMore',
    'click topicDeal-*': 'topicDeal'
};

exports.handlers = {
    topicMore: function() {
        $(window).unbind('scroll');
        this.app.show('content', 'ask/topic');
    },
    topicDeal: function(id) {
        $(window).unbind('scroll');
        this.app.show('content', 'ask/mymanage/topicdetail', { id: id });
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
