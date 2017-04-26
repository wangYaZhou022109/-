var _ = require('lodash/collection');
exports.bindings = {
    totalFront: true,
    talents: true,
    download: false,
    topicIds: 'changeTopics',
    search: true,
    topics: true
};

exports.events = {
    'click upload': 'showUpload',
    'click topic-*': 'searchTopic'
};

exports.handlers = {
    showUpload: function() {
        var model = this.module.items['knowledge/index/modal'];
        this.app.viewport.modal(model);
    },
    searchTopic: function(topicId) {
        var currentTopicIds = this.bindings.search.data.topicIds || [];
        if (currentTopicIds.indexOf(topicId) !== -1) {
            currentTopicIds = _.filter(currentTopicIds, function(i) {
                return i !== topicId;
            });
        } else {
            currentTopicIds.push(topicId);
        }
        return this.module.dispatch('search', { topicIds: currentTopicIds });
    }
};

exports.changeTopics = function() {
    var ids = _.map(this.bindings.topicIds.data, 'id');
    if (ids.length > 0) {
        this.module.dispatch('searchTopics', { ids: ids.join() });
    }
};

exports.dataForTemplate = {
    talents: function(data) {
        var dir = this.bindings.download.getFullUrl() + '?id=';
        return _.map(data.talents, function(obj) {
            var member = obj || {},
                src = 'images/d1.jpg';
            if (member.head) {
                src = dir + member.head;
            }
            member.head = src;
            return member;
        });
    },
    topics: function(data) {
        var selectTopicId = data.search.topicIds;
        if (!selectTopicId) return data.topics;
        data.topics.forEach(function(t) {
            var topic = t || {};
            if (selectTopicId.indexOf(topic.id) !== -1) topic.active = true;
        });
        return data.topics;
    }
};
