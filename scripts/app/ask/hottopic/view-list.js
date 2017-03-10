
var D = require('drizzlejs');
var $ = require('jquery');
exports.type = 'dynamic';
exports.bindings = {
    topic: true
};

exports.events = {
    'click topic-more': 'topicMore',
};

exports.handlers = {
    topicMore: function() {
        this.app.show('content', 'ask/topic');
    }
};

exports.dataForTemplate = {
};
