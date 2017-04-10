
var $ = require('jquery');
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
        $(window).unbind('scroll');
        this.app.show('content', 'ask/topic');
    },
    topicDeal: function(id) {
        $(window).unbind('scroll');
        this.app.show('content', 'ask/mymanage/topicdetail', { id: id });
    }
};

exports.dataForTemplate = {
};
