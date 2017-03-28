
// var D = require('drizzlejs');
// var $ = require('jquery');
exports.type = 'dynamic';
exports.bindings = {
    topic: true
};

exports.events = {
    'click topic-more': 'topicMore',
    'click topicDeal-*': 'topicDeal'
};

exports.handlers = {
    topicMore: function() {
        this.app.show('content', 'ask/topic');
    },
    topicDeal: function(id) {
        this.app.show('content', 'ask/mymanage/topicdetail', { id: id });
    }
};

exports.dataForTemplate = {
};
