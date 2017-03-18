var _ = require('lodash/collection');
exports.bindings = {
    totalFront: true,
    talents: true,
    download: false,
    topicIds: 'changeTopics',
    topics: true
};

exports.events = {
    'click upload': 'showUpload'
};

exports.handlers = {
    showUpload: function() {
        var model = this.module.items['knowledge/index/modal'];
        this.app.viewport.modal(model);
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
    }
};
