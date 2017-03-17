var _ = require('lodash/collection');
exports.bindings = {
    totalFront: true,
    talents: true,
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
